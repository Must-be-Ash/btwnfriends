// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {SimplifiedEscrow} from "../src/contracts/SimplifiedEscrow.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";

contract SimplifiedEscrowTest is Test {
    SimplifiedEscrow public escrow;
    ERC20Mock public usdc;
    
    address public admin = address(0x1);
    address public sender = address(0x2);
    address public recipient = address(0x3);
    address public attacker = address(0x4);
    
    string public recipientEmail = "test@example.com";
    bytes32 public recipientEmailHash;
    bytes32 public transferId = keccak256("test_transfer_1");
    uint256 public amount = 100 * 10**6; // 100 USDC
    uint256 public timeoutDays = 7;
    
    event Deposited(
        bytes32 indexed transferId,
        address indexed sender,
        uint256 amount,
        bytes32 recipientEmailHash,
        uint256 expiryTime
    );
    
    event Released(
        bytes32 indexed transferId,
        address indexed recipient,
        uint256 amount,
        bytes32 recipientEmailHash
    );
    
    event Refunded(
        bytes32 indexed transferId,
        address indexed sender,
        uint256 amount
    );
    
    function setUp() public {
        // Deploy mock USDC
        usdc = new ERC20Mock();
        
        // Deploy escrow contract
        vm.prank(admin);
        escrow = new SimplifiedEscrow(address(usdc));
        
        // Calculate email hash
        recipientEmailHash = keccak256(bytes(recipientEmail));
        
        // Setup initial balances
        usdc.mint(sender, 1000 * 10**6); // 1000 USDC
        usdc.mint(recipient, 100 * 10**6); // 100 USDC
        usdc.mint(attacker, 500 * 10**6); // 500 USDC
        
        // Approve escrow to spend USDC
        vm.prank(sender);
        usdc.approve(address(escrow), type(uint256).max);
        
        vm.prank(recipient);
        usdc.approve(address(escrow), type(uint256).max);
        
        vm.prank(attacker);
        usdc.approve(address(escrow), type(uint256).max);
    }
    
    // ===== BASIC FUNCTIONALITY TESTS =====
    
    function test_BasicDeposit() public {
        vm.prank(sender);
        
        // Expect the Deposited event
        vm.expectEmit(true, true, false, true);
        emit Deposited(
            transferId,
            sender,
            amount,
            recipientEmailHash,
            block.timestamp + (timeoutDays * 1 days)
        );
        
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        // Verify transfer details
        (
            address storedSender,
            uint256 storedAmount,
            bytes32 storedEmailHash,
            uint256 expiryTime,
            bool claimed,
            bool refunded
        ) = escrow.getTransfer(transferId);
        
        assertEq(storedSender, sender);
        assertEq(storedAmount, amount);
        assertEq(storedEmailHash, recipientEmailHash);
        assertEq(expiryTime, block.timestamp + (timeoutDays * 1 days));
        assertFalse(claimed);
        assertFalse(refunded);
        
        // Verify USDC was transferred
        assertEq(usdc.balanceOf(address(escrow)), amount);
        assertEq(usdc.balanceOf(sender), 1000 * 10**6 - amount);
    }
    
    function test_AdminRelease() public {
        // First, make a deposit
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        uint256 recipientBalanceBefore = usdc.balanceOf(recipient);
        uint256 escrowBalanceBefore = usdc.balanceOf(address(escrow));
        
        // Admin releases funds
        vm.prank(admin);
        
        vm.expectEmit(true, true, false, true);
        emit Released(transferId, recipient, amount, recipientEmailHash);
        
        escrow.adminRelease(transferId, recipientEmail, recipient);
        
        // Verify transfer was marked as claimed
        (, , , , bool claimed, bool refunded) = escrow.getTransfer(transferId);
        assertTrue(claimed);
        assertFalse(refunded);
        
        // Verify USDC was transferred to recipient
        assertEq(usdc.balanceOf(recipient), recipientBalanceBefore + amount);
        assertEq(usdc.balanceOf(address(escrow)), escrowBalanceBefore - amount);
    }
    
    function test_RefundAfterTimeout() public {
        // Make a deposit
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        // Fast forward past expiry
        vm.warp(block.timestamp + (timeoutDays * 1 days) + 1);
        
        uint256 senderBalanceBefore = usdc.balanceOf(sender);
        
        // Sender refunds
        vm.prank(sender);
        
        vm.expectEmit(true, true, false, true);
        emit Refunded(transferId, sender, amount);
        
        escrow.refund(transferId);
        
        // Verify transfer was marked as refunded
        (, , , , bool claimed, bool refunded) = escrow.getTransfer(transferId);
        assertFalse(claimed);
        assertTrue(refunded);
        
        // Verify USDC was returned to sender
        assertEq(usdc.balanceOf(sender), senderBalanceBefore + amount);
    }
    
    // ===== SECURITY TESTS =====
    
    function test_RevertInvalidDeposit() public {
        vm.prank(sender);
        
        // Invalid transfer ID
        vm.expectRevert("Invalid transfer ID");
        escrow.deposit(bytes32(0), amount, recipientEmailHash, timeoutDays);
        
        // Invalid amount
        vm.expectRevert("Amount must be positive");
        escrow.deposit(transferId, 0, recipientEmailHash, timeoutDays);
        
        // Invalid email hash
        vm.expectRevert("Invalid email hash");
        escrow.deposit(transferId, amount, bytes32(0), timeoutDays);
        
        // Invalid timeout
        vm.expectRevert("Invalid timeout period");
        escrow.deposit(transferId, amount, recipientEmailHash, 0);
        
        vm.expectRevert("Invalid timeout period");
        escrow.deposit(transferId, amount, recipientEmailHash, 366);
    }
    
    function test_RevertDuplicateTransferId() public {
        // First deposit succeeds
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        // Second deposit with same ID fails
        vm.prank(sender);
        vm.expectRevert("Transfer ID already exists");
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
    }
    
    function test_RevertNonAdminRelease() public {
        // Make a deposit
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        // Non-admin tries to release
        vm.prank(attacker);
        vm.expectRevert();
        escrow.adminRelease(transferId, recipientEmail, recipient);
    }
    
    function test_RevertAdminReleaseWrongEmail() public {
        // Make a deposit
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        // Admin tries to release with wrong email
        vm.prank(admin);
        vm.expectRevert("Email mismatch");
        escrow.adminRelease(transferId, "wrong@example.com", recipient);
    }
    
    function test_RevertAdminReleaseNonexistentTransfer() public {
        vm.prank(admin);
        vm.expectRevert("Transfer not found");
        escrow.adminRelease(transferId, recipientEmail, recipient);
    }
    
    function test_RevertAdminReleaseAlreadyClaimed() public {
        // Make deposit and claim
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        vm.prank(admin);
        escrow.adminRelease(transferId, recipientEmail, recipient);
        
        // Try to claim again
        vm.prank(admin);
        vm.expectRevert("Already claimed");
        escrow.adminRelease(transferId, recipientEmail, recipient);
    }
    
    function test_RevertAdminReleaseAfterRefund() public {
        // Make deposit
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        // Fast forward and refund
        vm.warp(block.timestamp + (timeoutDays * 1 days) + 1);
        vm.prank(sender);
        escrow.refund(transferId);
        
        // Try to admin release after refund
        vm.prank(admin);
        vm.expectRevert("Already refunded");
        escrow.adminRelease(transferId, recipientEmail, recipient);
    }
    
    function test_RevertAdminReleaseExpired() public {
        // Make deposit
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        // Fast forward past expiry
        vm.warp(block.timestamp + (timeoutDays * 1 days) + 1);
        
        // Admin tries to release expired transfer
        vm.prank(admin);
        vm.expectRevert("Transfer expired");
        escrow.adminRelease(transferId, recipientEmail, recipient);
    }
    
    function test_RevertRefundNotExpired() public {
        // Make deposit
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        // Try to refund before expiry
        vm.prank(sender);
        vm.expectRevert("Not yet expired");
        escrow.refund(transferId);
    }
    
    function test_RevertRefundNotSender() public {
        // Make deposit
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        // Fast forward past expiry
        vm.warp(block.timestamp + (timeoutDays * 1 days) + 1);
        
        // Non-sender tries to refund
        vm.prank(attacker);
        vm.expectRevert("Not the sender");
        escrow.refund(transferId);
    }
    
    function test_RevertRefundAlreadyClaimed() public {
        // Make deposit and claim
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        vm.prank(admin);
        escrow.adminRelease(transferId, recipientEmail, recipient);
        
        // Fast forward past expiry
        vm.warp(block.timestamp + (timeoutDays * 1 days) + 1);
        
        // Try to refund claimed transfer
        vm.prank(sender);
        vm.expectRevert("Already claimed");
        escrow.refund(transferId);
    }
    
    // ===== EDGE CASE TESTS =====
    
    function test_MultipleTransfersToSameEmail() public {
        bytes32 transferId2 = keccak256("test_transfer_2");
        
        // Make two deposits to same email
        vm.startPrank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        escrow.deposit(transferId2, amount * 2, recipientEmailHash, timeoutDays);
        vm.stopPrank();
        
        // Admin can release both
        vm.startPrank(admin);
        escrow.adminRelease(transferId, recipientEmail, recipient);
        escrow.adminRelease(transferId2, recipientEmail, recipient);
        vm.stopPrank();
        
        // Verify recipient received both amounts
        assertEq(usdc.balanceOf(recipient), 100 * 10**6 + amount + (amount * 2));
    }
    
    function test_IsClaimableAndRefundable() public {
        // Initially not claimable
        assertFalse(escrow.isClaimable(transferId));
        assertFalse(escrow.isRefundable(transferId));
        
        // Make deposit
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        // Now claimable but not refundable
        assertTrue(escrow.isClaimable(transferId));
        assertFalse(escrow.isRefundable(transferId));
        
        // Fast forward past expiry
        vm.warp(block.timestamp + (timeoutDays * 1 days) + 1);
        
        // Now refundable but not claimable
        assertFalse(escrow.isClaimable(transferId));
        assertTrue(escrow.isRefundable(transferId));
    }
    
    function test_EmergencyWithdraw() public {
        // Make a deposit
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        // Admin withdraws stuck tokens
        vm.prank(admin);
        escrow.emergencyWithdraw(address(usdc), amount);
        
        // Admin received the tokens
        assertEq(usdc.balanceOf(admin), amount);
        assertEq(usdc.balanceOf(address(escrow)), 0);
    }
    
    function test_RevertEmergencyWithdrawNonOwner() public {
        vm.prank(attacker);
        vm.expectRevert();
        escrow.emergencyWithdraw(address(usdc), amount);
    }
    
    // ===== GAS OPTIMIZATION TESTS =====
    
    function test_GasUsageDeposit() public {
        vm.prank(sender);
        uint256 gasBefore = gasleft();
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        uint256 gasUsed = gasBefore - gasleft();
        
        console.log("Gas used for deposit:", gasUsed);
        // Should be reasonable for Base network (151k gas = ~$0.0002-0.01)
        assertLt(gasUsed, 500000);
    }
    
    function test_GasUsageAdminRelease() public {
        // Make deposit first
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        vm.prank(admin);
        uint256 gasBefore = gasleft();
        escrow.adminRelease(transferId, recipientEmail, recipient);
        uint256 gasUsed = gasBefore - gasleft();
        
        console.log("Gas used for admin release:", gasUsed);
        // Should be reasonable for Base network (45k gas = ~$0.0001-0.005)
        assertLt(gasUsed, 200000);
    }

    function test_AdminRefund() public {
        // Make deposit first
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        // Fast forward past expiry (7 days + 1 second)
        vm.warp(block.timestamp + (timeoutDays * 1 days) + 1);
        
        // Check balances before refund
        uint256 senderBalanceBefore = usdc.balanceOf(sender);
        uint256 contractBalanceBefore = usdc.balanceOf(address(escrow));
        
        // Admin refunds to original sender
        vm.prank(admin);
        escrow.adminRefund(transferId);
        
        // Verify refund succeeded
        (, , , , bool claimed, bool refunded) = escrow.getTransfer(transferId);
        assertFalse(claimed);
        assertTrue(refunded);
        
        // Verify USDC returned to original sender
        assertEq(usdc.balanceOf(sender), senderBalanceBefore + amount);
        assertEq(usdc.balanceOf(address(escrow)), contractBalanceBefore - amount);
    }
    
    function test_AdminRefundFailsBeforeExpiry() public {
        // Make deposit first
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        // Try to refund before expiry (should fail)
        vm.prank(admin);
        vm.expectRevert("Not yet expired");
        escrow.adminRefund(transferId);
    }
    
    function test_AdminRefundFailsIfAlreadyClaimed() public {
        // Make deposit first
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        // Claim first
        vm.prank(admin);
        escrow.adminRelease(transferId, recipientEmail, recipient);
        
        // Fast forward past expiry
        vm.warp(block.timestamp + (timeoutDays * 1 days) + 1);
        
        // Try to refund after claiming (should fail)
        vm.prank(admin);
        vm.expectRevert("Already claimed");
        escrow.adminRefund(transferId);
    }
    
    function test_AdminRefundOnlyOwner() public {
        // Make deposit first
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        // Fast forward past expiry
        vm.warp(block.timestamp + (timeoutDays * 1 days) + 1);
        
        // Try to refund as non-owner (should fail)
        vm.prank(sender);
        vm.expectRevert();
        escrow.adminRefund(transferId);
    }
    
    function test_GasUsageAdminRefund() public {
        // Make deposit first
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        // Fast forward past expiry
        vm.warp(block.timestamp + (timeoutDays * 1 days) + 1);
        
        vm.prank(admin);
        uint256 gasBefore = gasleft();
        escrow.adminRefund(transferId);
        uint256 gasUsed = gasBefore - gasleft();
        
        console.log("Gas used for admin refund:", gasUsed);
        // Should be reasonable for Base network (~50k gas = ~$0.0001-0.005)
        assertLt(gasUsed, 200000);
    }
    
    // ===== INTEGRATION TESTS =====
    
    function test_FullWorkflow() public {
        uint256 senderInitialBalance = usdc.balanceOf(sender);
        uint256 recipientInitialBalance = usdc.balanceOf(recipient);
        
        // 1. Sender deposits
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        assertEq(usdc.balanceOf(sender), senderInitialBalance - amount);
        assertEq(usdc.balanceOf(address(escrow)), amount);
        
        // 2. Admin releases to recipient
        vm.prank(admin);
        escrow.adminRelease(transferId, recipientEmail, recipient);
        
        assertEq(usdc.balanceOf(recipient), recipientInitialBalance + amount);
        assertEq(usdc.balanceOf(address(escrow)), 0);
        
        // 3. Verify final state
        (, , , , bool claimed, bool refunded) = escrow.getTransfer(transferId);
        assertTrue(claimed);
        assertFalse(refunded);
    }
    
    function test_FullWorkflowWithRefund() public {
        uint256 senderInitialBalance = usdc.balanceOf(sender);
        
        // 1. Sender deposits
        vm.prank(sender);
        escrow.deposit(transferId, amount, recipientEmailHash, timeoutDays);
        
        assertEq(usdc.balanceOf(sender), senderInitialBalance - amount);
        
        // 2. Time passes and sender refunds
        vm.warp(block.timestamp + (timeoutDays * 1 days) + 1);
        
        vm.prank(sender);
        escrow.refund(transferId);
        
        // 3. Sender got their money back
        assertEq(usdc.balanceOf(sender), senderInitialBalance);
        assertEq(usdc.balanceOf(address(escrow)), 0);
        
        // 4. Verify final state
        (, , , , bool claimed, bool refunded) = escrow.getTransfer(transferId);
        assertFalse(claimed);
        assertTrue(refunded);
    }
}