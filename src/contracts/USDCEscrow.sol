// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title USDCEscrow
 * @dev Bulletproof escrow for email-based USDC transfers
 * @notice Holds USDC until backend verifies recipient email ownership via CDP
 */
contract USDCEscrow is ReentrancyGuard, Ownable, Pausable {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // USDC token contract
    IERC20 public immutable usdcToken;
    
    // Trusted backend signer (our API server)
    address public trustedSigner;
    
    // Default timeout: 7 days
    uint256 public constant DEFAULT_TIMEOUT = 7 days;
    uint256 public constant MAX_TIMEOUT = 30 days;

    struct Transfer {
        address sender;           // Who deposited the funds
        uint256 amount;          // Amount of USDC escrowed
        uint256 expiryTime;      // When sender can refund
        bool claimed;            // Claimed by recipient
        bool refunded;           // Refunded to sender
        bool disputed;           // Marked as disputed (wrong recipient)
    }

    // transferId => Transfer details
    mapping(bytes32 => Transfer) public transfers;
    
    // Nonces to prevent signature replay attacks
    mapping(address => uint256) public nonces;
    
    // Total USDC held in escrow
    uint256 public totalEscrowed;

    // Events
    event TransferDeposited(
        bytes32 indexed transferId,
        address indexed sender,
        uint256 amount,
        uint256 expiryTime
    );
    
    event TransferClaimed(
        bytes32 indexed transferId,
        address indexed recipient,
        uint256 amount
    );
    
    event TransferRefunded(
        bytes32 indexed transferId,
        address indexed sender,
        uint256 amount
    );
    
    event TransferDisputed(
        bytes32 indexed transferId,
        address indexed sender
    );

    event TrustedSignerUpdated(
        address indexed oldSigner,
        address indexed newSigner
    );

    // Custom errors
    error TransferNotFound();
    error TransferAlreadyProcessed();
    error TransferNotExpired();
    error TransferExpired();
    error UnauthorizedSender();
    error InvalidAmount();
    error InvalidTimeout();
    error InvalidSignature();
    error SignatureExpired();
    error ZeroAddress();

    constructor(address _usdcToken, address _trustedSigner) Ownable(msg.sender) {
        if (_usdcToken == address(0) || _trustedSigner == address(0)) {
            revert ZeroAddress();
        }
        
        usdcToken = IERC20(_usdcToken);
        trustedSigner = _trustedSigner;
    }

    /**
     * @dev Deposit USDC into escrow
     * @param transferId Unique identifier for this transfer
     * @param amount Amount of USDC to escrow
     * @param timeoutDuration How long before sender can refund (max 30 days)
     */
    function deposit(
        bytes32 transferId,
        uint256 amount,
        uint256 timeoutDuration
    ) external nonReentrant whenNotPaused {
        if (amount == 0) revert InvalidAmount();
        if (timeoutDuration > MAX_TIMEOUT) revert InvalidTimeout();
        if (transfers[transferId].sender != address(0)) revert TransferAlreadyProcessed();

        uint256 timeout = timeoutDuration == 0 ? DEFAULT_TIMEOUT : timeoutDuration;
        uint256 expiryTime = block.timestamp + timeout;

        // Transfer USDC from sender to this contract
        usdcToken.safeTransferFrom(msg.sender, address(this), amount);

        // Store transfer details (no email data stored on-chain)
        transfers[transferId] = Transfer({
            sender: msg.sender,
            amount: amount,
            expiryTime: expiryTime,
            claimed: false,
            refunded: false,
            disputed: false
        });

        totalEscrowed += amount;

        emit TransferDeposited(transferId, msg.sender, amount, expiryTime);
    }

    /**
     * @dev Claim transfer with backend signature
     * @param transferId The transfer to claim
     * @param recipient Address to receive the USDC
     * @param deadline Signature expiration timestamp
     * @param signature Backend signature authorizing the claim
     */
    function claim(
        bytes32 transferId,
        address recipient,
        uint256 deadline,
        bytes calldata signature
    ) external nonReentrant whenNotPaused {
        Transfer storage transfer = transfers[transferId];
        
        if (transfer.sender == address(0)) revert TransferNotFound();
        if (transfer.claimed || transfer.refunded) revert TransferAlreadyProcessed();
        if (block.timestamp > transfer.expiryTime) revert TransferExpired();
        if (block.timestamp > deadline) revert SignatureExpired();
        if (recipient == address(0)) revert ZeroAddress();

        // Verify backend signature
        bytes32 messageHash = keccak256(abi.encodePacked(
            transferId,
            recipient,
            deadline,
            nonces[recipient],
            address(this),
            block.chainid
        ));
        
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        if (ethSignedMessageHash.recover(signature) != trustedSigner) {
            revert InvalidSignature();
        }

        // Increment nonce to prevent replay
        nonces[recipient]++;

        // Mark as claimed
        transfer.claimed = true;
        totalEscrowed -= transfer.amount;

        // Transfer USDC to verified recipient
        usdcToken.safeTransfer(recipient, transfer.amount);

        emit TransferClaimed(transferId, recipient, transfer.amount);
    }

    /**
     * @dev Refund expired transfer back to sender
     * @param transferId The transfer to refund
     */
    function refund(bytes32 transferId) external nonReentrant {
        Transfer storage transfer = transfers[transferId];
        
        if (transfer.sender == address(0)) revert TransferNotFound();
        if (transfer.claimed || transfer.refunded) revert TransferAlreadyProcessed();
        if (block.timestamp <= transfer.expiryTime && !transfer.disputed) revert TransferNotExpired();
        if (transfer.sender != msg.sender) revert UnauthorizedSender();

        // Mark as refunded
        transfer.refunded = true;
        totalEscrowed -= transfer.amount;

        // Transfer USDC back to sender
        usdcToken.safeTransfer(transfer.sender, transfer.amount);

        emit TransferRefunded(transferId, transfer.sender, transfer.amount);
    }

    /**
     * @dev Mark transfer as disputed (wrong recipient)
     * @param transferId The transfer to dispute
     */
    function disputeTransfer(bytes32 transferId) external {
        Transfer storage transfer = transfers[transferId];
        
        if (transfer.sender == address(0)) revert TransferNotFound();
        if (transfer.claimed || transfer.refunded) revert TransferAlreadyProcessed();
        if (transfer.sender != msg.sender) revert UnauthorizedSender();

        transfer.disputed = true;

        emit TransferDisputed(transferId, msg.sender);
    }

    /**
     * @dev Emergency claim by owner (for customer support)
     * @param transferId The transfer to claim
     * @param recipient Address to receive funds
     */
    function emergencyClaim(
        bytes32 transferId,
        address recipient
    ) external onlyOwner nonReentrant {
        Transfer storage transfer = transfers[transferId];
        
        if (transfer.sender == address(0)) revert TransferNotFound();
        if (transfer.claimed || transfer.refunded) revert TransferAlreadyProcessed();
        if (recipient == address(0)) revert ZeroAddress();

        // Mark as claimed
        transfer.claimed = true;
        totalEscrowed -= transfer.amount;

        // Transfer USDC to recipient
        usdcToken.safeTransfer(recipient, transfer.amount);

        emit TransferClaimed(transferId, recipient, transfer.amount);
    }

    /**
     * @dev Emergency refund by owner (for customer support)
     * @param transferId The transfer to refund
     */
    function emergencyRefund(bytes32 transferId) external onlyOwner nonReentrant {
        Transfer storage transfer = transfers[transferId];
        
        if (transfer.sender == address(0)) revert TransferNotFound();
        if (transfer.claimed || transfer.refunded) revert TransferAlreadyProcessed();

        // Mark as refunded
        transfer.refunded = true;
        totalEscrowed -= transfer.amount;

        // Transfer USDC back to sender
        usdcToken.safeTransfer(transfer.sender, transfer.amount);

        emit TransferRefunded(transferId, transfer.sender, transfer.amount);
    }

    /**
     * @dev Update trusted signer address
     * @param newSigner New trusted signer address
     */
    function updateTrustedSigner(address newSigner) external onlyOwner {
        if (newSigner == address(0)) revert ZeroAddress();
        
        address oldSigner = trustedSigner;
        trustedSigner = newSigner;
        
        emit TrustedSignerUpdated(oldSigner, newSigner);
    }

    /**
     * @dev Get transfer details
     */
    function getTransfer(bytes32 transferId) 
        external 
        view 
        returns (
            address sender,
            uint256 amount,
            uint256 expiryTime,
            bool claimed,
            bool refunded,
            bool disputed
        ) 
    {
        Transfer memory transfer = transfers[transferId];
        return (
            transfer.sender,
            transfer.amount,
            transfer.expiryTime,
            transfer.claimed,
            transfer.refunded,
            transfer.disputed
        );
    }

    /**
     * @dev Check if transfer is claimable
     */
    function isClaimable(bytes32 transferId) external view returns (bool) {
        Transfer memory transfer = transfers[transferId];
        return (
            transfer.sender != address(0) &&
            !transfer.claimed &&
            !transfer.refunded &&
            block.timestamp <= transfer.expiryTime
        );
    }

    /**
     * @dev Check if transfer is refundable
     */
    function isRefundable(bytes32 transferId) external view returns (bool) {
        Transfer memory transfer = transfers[transferId];
        return (
            transfer.sender != address(0) &&
            !transfer.claimed &&
            !transfer.refunded &&
            (block.timestamp > transfer.expiryTime || transfer.disputed)
        );
    }

    /**
     * @dev Pause contract (owner only)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause contract (owner only)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency withdrawal (owner only, when paused)
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner whenPaused {
        usdcToken.safeTransfer(owner(), amount);
    }
}