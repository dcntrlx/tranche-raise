// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {Campaign} from "../src/Campaign.sol";

contract CampaignScript is Script {
    function run() public {
        vm.startBroadcast();
        Campaign campaign = new Campaign("Campaign", 100, 100, msg.sender);
        vm.stopBroadcast();
    }
}
