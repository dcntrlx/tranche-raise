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
        campaignFactory.createCampaign(campaignTitle, "", campaignGoal, campaignDuration);
        address[] memory campaigns = campaignFactory.getAllCampaigns();
        assertEq(campaigns.length, 1);
        assertEq(Campaign(campaigns[0]).campaignTitle(), campaignTitle);
        assertEq(Campaign(campaigns[0]).CAMPAIGN_GOAL(), campaignGoal);
        assertEq(Campaign(campaigns[0]).CAMPAIGN_DURATION(), campaignDuration);
    }

    function test_CreateMultipleCampaigns() public {
        campaignFactory.createCampaign("Campaign 1", "", 100, 1000);
        campaignFactory.createCampaign("Campaign 2", "", 200, 2000);

        address[] memory campaigns = campaignFactory.getAllCampaigns();
        assertEq(campaigns.length, 2);
        assertEq(Campaign(campaigns[0]).campaignTitle(), "Campaign 1");
        assertEq(Campaign(campaigns[1]).campaignTitle(), "Campaign 2");
        assertTrue(campaigns[0] != campaigns[1]);
    }

    function test_CampaignOwnership() public {
        address creator = makeAddr("creator");
        vm.prank(creator);
        campaignFactory.createCampaign("My Campaign", "", 100, 1000);

        address[] memory campaigns = campaignFactory.getAllCampaigns();
        assertEq(Campaign(campaigns[0]).OWNER(), creator);
    }
}
