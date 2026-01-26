// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {Campaign} from "../src/Campaign.sol";

import "@openzeppelin/contracts/proxy/Clones.sol";

contract CampaignScript is Script {
    function run() public {
        vm.startBroadcast();
        Campaign implementation = new Campaign();
        Campaign campaign = Campaign(Clones.clone(address(implementation)));
        campaign.initialize("Campaign", "", 100, 100, msg.sender);
        vm.stopBroadcast();
    }
}
