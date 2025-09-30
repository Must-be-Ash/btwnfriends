// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/contracts/SimpleEscrow.sol";

contract DeploySimpleEscrowMainnet is Script {
    // USDC address on Base Mainnet
    address constant USDC_BASE_MAINNET = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_WALLET_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("=== BASE MAINNET DEPLOYMENT ===");
        console.log("Deploying SimpleEscrow from:", deployer);
        console.log("Deployer balance:", deployer.balance);
        console.log("USDC address (Base Mainnet):", USDC_BASE_MAINNET);
        console.log("Network: Base Mainnet (Chain ID: 8453)");
        
        require(deployer.balance > 0.0005 ether, "Insufficient ETH for deployment");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy SimpleEscrow contract with Base Mainnet USDC
        SimpleEscrow simpleEscrow = new SimpleEscrow(USDC_BASE_MAINNET);
        
        vm.stopBroadcast();
        
        console.log("\n=== DEPLOYMENT SUCCESSFUL ===");
        console.log("SimpleEscrow deployed at:", address(simpleEscrow));
        console.log("Owner:", simpleEscrow.owner());
        console.log("USDC token:", address(simpleEscrow.usdc()));
        
        console.log("\n=== NEXT STEPS ===");
        console.log("1. Update .env with mainnet address:");
        console.log("NEXT_PUBLIC_SIMPLE_ESCROW_ADDRESS_MAINNET=%s", address(simpleEscrow));
        console.log("\n2. Verify the contract on BaseScan:");
        console.log("https://basescan.org/address/%s", address(simpleEscrow));
        console.log("\n3. Fund admin wallet with ETH for gas costs:");
        console.log("Admin wallet: %s", deployer);
        console.log("\n4. Test with a small transfer on mainnet");
        
        console.log("\n=== IMPORTANT SECURITY NOTES ===");
        console.log("- The deployer wallet is now the owner of the SimpleEscrow contract");
        console.log("- This wallet will pay gas for all user claims");
        console.log("- Keep this wallet funded with ETH but not excessive amounts");
        console.log("- Monitor gas costs and contract usage");
    }
}