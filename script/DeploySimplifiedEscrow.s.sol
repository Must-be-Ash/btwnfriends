// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {SimplifiedEscrow} from "../src/contracts/SimplifiedEscrow.sol";

contract DeploySimplifiedEscrow is Script {
    // Base Sepolia USDC address (testnet)
    address constant BASE_SEPOLIA_USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    
    function run() external returns (SimplifiedEscrow) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_WALLET_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy SimplifiedEscrow contract
        SimplifiedEscrow simplifiedEscrow = new SimplifiedEscrow(BASE_SEPOLIA_USDC);
        
        console.log("SimplifiedEscrow deployed to:", address(simplifiedEscrow));
        console.log("Owner:", simplifiedEscrow.owner());
        console.log("USDC Token:", address(simplifiedEscrow.usdc()));
        
        vm.stopBroadcast();
        
        return simplifiedEscrow;
    }
}