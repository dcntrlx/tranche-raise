// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {CampaignFactory} from "../src/CampaignFactory.sol";
import {Script} from "forge-std/Script.sol";

contract CampaignFactoryScript is Script {
    function run() public {
        vm.startBroadcast();
        CampaignFactory campaignFactory = new CampaignFactory();
        vm.stopBroadcast();
    }
}
