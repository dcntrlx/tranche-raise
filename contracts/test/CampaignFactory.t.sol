// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CampaignFactory} from "../src/CampaignFactory.sol";
import {Campaign} from "../src/Campaign.sol";

contract CampaignFactoryTest is Test {
    CampaignFactory public campaignFactory;

    function setUp() public {
        campaignFactory = new CampaignFactory();
    }

    /// @notice Tests creating campaign functilonality
    /// @dev Checks if all properties are set correctly on a new campaign
    function test_CreateCampaign() public {
        uint256 campaignGoal = 1000;
        uint256 campaignDuration = 100000;
        string memory campaignTitle = "Test Campaign";
        campaignFactory.createCampaign(campaignTitle, campaignGoal, campaignDuration);
        address[] memory campaigns = campaignFactory.getAllCampaigns();
        assertEq(campaigns.length, 1);
        assertEq(Campaign(campaigns[0]).campaignTitle(), campaignTitle);
        assertEq(Campaign(campaigns[0]).CAMPAIGN_GOAL(), campaignGoal);
        assertEq(Campaign(campaigns[0]).CAMPAIGN_DURATION(), campaignDuration);
    }
}
