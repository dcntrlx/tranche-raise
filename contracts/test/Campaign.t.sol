// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Campaign} from "../src/Campaign.sol";
import {console} from "forge-std/console.sol";

contract CampaignTest is Test {
    address public owner;
    Campaign campaign;
    uint256 campaignGoal;
    uint256 campaignDuration;
    uint256 campaignStart;

    function setUp() public {
        owner = makeAddr("owner");
        campaignGoal = 10 ether;
        campaignDuration = 7 days;
        campaignStart = block.timestamp;
        campaign = new Campaign("Test Campaign", campaignGoal, campaignDuration, owner);
    }

    /// @notice Tests that the campaign is active after start
    function test_IsActive() public {
        assertTrue(campaign.state() == Campaign.CampaignState.Fundraising);
    }

    /// @notice Tests that the campaign is not active after end of campaign
    function test_IfCampaignEnds() public {
        vm.warp(campaignStart + campaignDuration + 1);
        assertFalse(campaign.state() == Campaign.CampaignState.Fundraising);
    }

    /// @notice Test if state of campaign going from Fundraising to Distributing after goal reached
    function testFundraisingEndsAfterGoalReached() public {
        campaign.fund{value: campaign.CAMPAIGN_GOAL()}();
        vm.assertTrue(campaign.state() == Campaign.CampaignState.Distributing);
    }

    /// @notice Test if backersRaise of user changes after funding
    function test_FundInFundraisingState() public {
        uint256 amount = 10 ** 18;
        campaign.fund{value: amount}();
        assertEq(campaign.backersRaises(address(this)), amount);
    }

    /// @notice Test if it possible to withdraw during funding stage(after funding)
    function test_Withdraw_InFundraisingState() public {
        uint256 amount = 10 ** 18;
        campaign.fund{value: amount}();
        campaign.withdraw(amount);
    }

    /// @notice Test if it impossible to withdraw more than funded
    function test_Withdraw_Revert_InFundraisingStateWithoutFunding() public {
        uint256 amount = 10 ** 18;
        campaign.fund{value: amount}();
        vm.expectRevert("You havent raised this much");
        campaign.withdraw(2 * amount);
    }

    /// @notice Test if it possible for owner to request a tranche during distributing stage
    function test_RequestTranche_OwnerInDistributingState() public {
        campaign.fund{value: 10 ether}();
        vm.prank(owner);
        campaign.requestTranche("New Tranche", 10 ** 18, payable(owner));
        assertTrue(campaign.getAllTranches()[0].state == Campaign.TrancheState.Voting);
    }

    /// @notice Test if tranches array is empty until first tranche is created
    function test_RequestTranche_TracncheNotExistsUntilCreated() public {
        campaign.fund{value: 10 ether}();
        assertEq(campaign.getAllTranches().length, 0, "Length of tranches should be 0 until first one was created");
    }

    /// @notice Test if it impossible to request a tranche before distributing stage
    function testRevert_RequestTranche_CantRequestTrancheBeforeDistributing() public {
        vm.expectRevert("Campaign is not in distributing state");
        campaign.requestTranche("New Tranche", 10 ** 18, payable(owner));
    }

    /// @notice Test if it impossible for non-owner to request a tranche
    function testRevert_RequestTranche_NotOwnerCantRequestTranche() public {
        campaign.fund{value: 10 ether}();
        vm.startPrank(address(1));
        vm.expectRevert("You are not an owner");
        campaign.requestTranche("New Tranche", 10 ** 18, payable(owner));
        vm.stopPrank();
    }

    function test_VoteForTranche() public {
        campaign.fund{value: 10 ether}();
        vm.prank(owner);
        campaign.requestTranche("New Tranche", 10 ** 17, payable(owner));
        campaign.voteForTranche(0, true);
        assertEq(campaign.getAllTranches()[0].votesFor, 10 ** 19);
        assertEq(uint256(campaign.getAllTranches()[0].state), uint256(Campaign.TrancheState.Executed));
    }

    receive() external payable {}
}
