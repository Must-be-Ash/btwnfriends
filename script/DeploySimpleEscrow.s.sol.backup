// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/contracts/SimpleEscrow.sol";

contract DeploySimpleEscrow is Script {
    // USDC address on Base Sepolia
    address constant USDC_BASE_SEPOLIA = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying SimpleEscrow from:", deployer);
        console.log("Deployer balance:", deployer.balance);
        console.log("USDC address:", USDC_BASE_SEPOLIA);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy SimpleEscrow contract
        SimpleEscrow simpleEscrow = new SimpleEscrow(USDC_BASE_SEPOLIA);
        
        vm.stopBroadcast();
        
        console.log("SimpleEscrow deployed at:", address(simpleEscrow));
        console.log("Owner:", simpleEscrow.owner());
        console.log("USDC token:", address(simpleEscrow.usdc()));
        
        console.log("\n=== Next Steps ===");
        console.log("1. Add to .env.local:");
        console.log("NEXT_PUBLIC_SIMPLE_ESCROW_ADDRESS=%s", address(simpleEscrow));
        console.log("2. Fund admin wallet with ETH for gas costs");
        console.log("3. Test with a small transfer");
    }
}