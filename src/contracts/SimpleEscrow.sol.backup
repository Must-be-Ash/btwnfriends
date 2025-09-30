// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SimpleEscrow
 * @notice Gasless email-based USDC escrow for Between Friends app
 * @dev Recipients claim through admin wallet (gasless), senders can refund after timeout
 */
contract SimpleEscrow is Ownable, ReentrancyGuard {
    IERC20 public immutable usdc;
    
    struct Transfer {
        address sender;
        uint256 amount;
        bytes32 claimSecretHash; // hash(email + claimToken) - no emails on-chain
        uint256 expiryTime;
        bool claimed;
        bool refunded;
    }
    
    mapping(bytes32 => Transfer) public transfers;
    
    // Events
    event Deposited(
        bytes32 indexed transferId, 
        address indexed sender, 
        uint256 amount, 
        uint256 expiryTime
    );
    
    event Released(
        bytes32 indexed transferId, 
        address indexed recipient, 
        uint256 amount
    );
    
    event Refunded(
        bytes32 indexed transferId, 
        address indexed sender, 
        uint256 amount
    );
    
    constructor(address _usdc) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        usdc = IERC20(_usdc);
    }
    
    /**
     * @notice Deposit USDC for email-based transfer
     * @param transferId Unique transfer identifier
     * @param amount Amount of USDC to deposit (in 6 decimals)
     * @param claimSecretHash Hash of (email + claimToken) - keeps email private
     * @param timeoutDays Number of days before sender can refund
     */
    function deposit(
        bytes32 transferId,
        uint256 amount,
        bytes32 claimSecretHash,
        uint256 timeoutDays
    ) external nonReentrant {
        require(transferId != bytes32(0), "Invalid transfer ID");
        require(amount > 0, "Amount must be positive");
        require(claimSecretHash != bytes32(0), "Invalid claim secret");
        require(timeoutDays > 0 && timeoutDays <= 365, "Invalid timeout period");
        require(transfers[transferId].sender == address(0), "Transfer ID already exists");
        
        uint256 expiryTime = block.timestamp + (timeoutDays * 1 days);
        
        // Store transfer details
        transfers[transferId] = Transfer({
            sender: msg.sender,
            amount: amount,
            claimSecretHash: claimSecretHash,
            expiryTime: expiryTime,
            claimed: false,
            refunded: false
        });
        
        // Transfer USDC from sender to this contract
        require(
            usdc.transferFrom(msg.sender, address(this), amount),
            "USDC transfer failed"
        );
        
        emit Deposited(transferId, msg.sender, amount, expiryTime);
    }
    
    /**
     * @notice Admin releases funds to verified recipient (gasless for recipient)
     * @dev Only owner (admin wallet) can call this - admin pays gas, recipient gets USDC
     * @param transferId The transfer to release
     * @param claimSecret The plaintext secret (email + claimToken) for verification
     * @param recipient Address to receive the USDC
     */
    function adminRelease(
        bytes32 transferId,
        string calldata claimSecret,
        address recipient
    ) external onlyOwner nonReentrant {
        require(recipient != address(0), "Invalid recipient");
        
        Transfer storage transfer = transfers[transferId];
        require(transfer.sender != address(0), "Transfer not found");
        require(!transfer.claimed, "Already claimed");
        require(!transfer.refunded, "Already refunded");
        require(block.timestamp <= transfer.expiryTime, "Transfer expired");
        
        // Verify claim secret matches what was stored during deposit
        bytes32 providedHash = keccak256(abi.encodePacked(claimSecret));
        require(providedHash == transfer.claimSecretHash, "Invalid claim secret");
        
        // Mark as claimed
        transfer.claimed = true;
        
        // Transfer USDC directly to recipient (recipient pays no gas!)
        require(
            usdc.transfer(recipient, transfer.amount),
            "USDC transfer failed"
        );
        
        emit Released(transferId, recipient, transfer.amount);
    }
    
    /**
     * @notice Sender can refund unclaimed transfers after timeout
     * @param transferId The transfer to refund
     */
    function refund(bytes32 transferId) external nonReentrant {
        Transfer storage transfer = transfers[transferId];
        require(transfer.sender == msg.sender, "Not the sender");
        require(!transfer.claimed, "Already claimed");
        require(!transfer.refunded, "Already refunded");
        require(block.timestamp > transfer.expiryTime, "Not yet expired");
        
        // Mark as refunded
        transfer.refunded = true;
        
        // Return USDC to sender
        require(
            usdc.transfer(msg.sender, transfer.amount),
            "USDC transfer failed"
        );
        
        emit Refunded(transferId, msg.sender, transfer.amount);
    }
    
    /**
     * @notice Get transfer details
     */
    function getTransfer(bytes32 transferId) external view returns (
        address sender,
        uint256 amount,
        bytes32 claimSecretHash,
        uint256 expiryTime,
        bool claimed,
        bool refunded
    ) {
        Transfer memory transfer = transfers[transferId];
        return (
            transfer.sender,
            transfer.amount,
            transfer.claimSecretHash,
            transfer.expiryTime,
            transfer.claimed,
            transfer.refunded
        );
    }
    
    /**
     * @notice Check if transfer is claimable
     */
    function isClaimable(bytes32 transferId) external view returns (bool) {
        Transfer memory transfer = transfers[transferId];
        return transfer.sender != address(0) && 
               !transfer.claimed && 
               !transfer.refunded && 
               block.timestamp <= transfer.expiryTime;
    }
    
    /**
     * @notice Check if transfer is refundable
     */
    function isRefundable(bytes32 transferId) external view returns (bool) {
        Transfer memory transfer = transfers[transferId];
        return transfer.sender != address(0) && 
               !transfer.claimed && 
               !transfer.refunded && 
               block.timestamp > transfer.expiryTime;
    }
    
    /**
     * @notice Emergency function to recover stuck tokens (only owner)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(owner(), amount), "Emergency withdrawal failed");
    }
}