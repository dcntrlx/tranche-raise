// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Campaign} from "../src/Campaign.sol";

contract CampaignTest is Test {
    Campaign campaign;
    uint256 campaignGoal;
    uint256 campaignDuration;
    uint256 campaignStart;

    function setUp() public {
        campaignGoal = 10 ether;
        campaignDuration = 7 days;
        campaignStart = block.timestamp;
        campaign = new Campaign("Test Campaign", campaignGoal, campaignDuration);
    }

    /// @notice Tests that the campaign is active after start
    function test_IsActive() public {
        assertTrue(campaign.isActive());
    }

    /// @notice Tests that the campaign is not active after end of campaign
    function test_IfCampaignEnds() public {
        vm.warp(campaignStart + campaignDuration + 1);
        assertFalse(campaign.isActive());
    }
}
