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
        assertTrue(campaign.state() == Campaign.CampaignState.Fundraising);
    }

    /// @notice Tests that the campaign is not active after end of campaign
    function test_IfCampaignEnds() public {
        vm.warp(campaignStart + campaignDuration + 1);
        assertFalse(campaign.state() == Campaign.CampaignState.Fundraising);
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

    receive() external payable {}
}
