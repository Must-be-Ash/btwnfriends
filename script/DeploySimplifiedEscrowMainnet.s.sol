// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {SimplifiedEscrow} from "../src/contracts/SimplifiedEscrow.sol";

contract DeploySimplifiedEscrowMainnet is Script {
    // Base Mainnet USDC address
    address constant BASE_MAINNET_USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    
    function run() external returns (SimplifiedEscrow) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_WALLET_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy SimplifiedEscrow contract
        SimplifiedEscrow simplifiedEscrow = new SimplifiedEscrow(BASE_MAINNET_USDC);
        
        console.log("SimplifiedEscrow deployed to:", address(simplifiedEscrow));
        console.log("Owner:", simplifiedEscrow.owner());
        console.log("USDC Token:", address(simplifiedEscrow.usdc()));
        
        vm.stopBroadcast();
        
        return simplifiedEscrow;
    }
}