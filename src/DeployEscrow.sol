// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "./contracts/USDCEscrow.sol";

contract DeployEscrow is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        address usdcToken = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
        address trustedSigner = 0x5b92a33dFDfD0EA4fEC0aFc0804Fd32cEa185c38;
        
        vm.startBroadcast(deployerPrivateKey);
        
        USDCEscrow escrow = new USDCEscrow(usdcToken, trustedSigner);
        
        console.log("USDCEscrow deployed to:", address(escrow));
        
        vm.stopBroadcast();
    }
}