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
        address user = makeAddr("user");
        vm.deal(user, 10 ether);
        uint256 amount = 1 ether;

        vm.startPrank(user);
        campaign.fund{value: amount}();
        campaign.withdraw(amount);
        vm.stopPrank();

        assertEq(user.balance, 10 ether);
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

    /// @notice Test to check if vote + executed tranche works
    function test_VoteForTranche() public {
        campaign.fund{value: 10 ether}();
        vm.prank(owner);
        campaign.requestTranche("New Tranche", 10 ** 17, payable(owner));
        campaign.voteForTranche(0, true);
        assertEq(campaign.getAllTranches()[0].votesFor, 10 ** 19);
        assertEq(uint256(campaign.getAllTranches()[0].state), uint256(Campaign.TrancheState.Executed));
    }

    /// @notice Test to check if vote against works and rejects tranche
    function test_VoteAgainstTranche_Rejection() public {
        campaign.fund{value: 10 ether}();
        vm.prank(owner);
        campaign.requestTranche("New Tranche", 10 ** 17, payable(owner));
        campaign.voteForTranche(0, false);
        assertEq(campaign.getAllTranches()[0].votesAgainst, 10 ether);
        assertEq(uint256(campaign.getAllTranches()[0].state), uint256(Campaign.TrancheState.Failed));
    }

    /// @notice Test if double voting reverts
    function testRevert_DoubleVoting() public {
        // Owner funds 4 ether
        campaign.fund{value: 4 ether}();

        // Other user funds 6 ether to reach goal (10) but keep owner < 50%
        address other = makeAddr("other");
        vm.deal(other, 6 ether);
        vm.prank(other);
        campaign.fund{value: 6 ether}();

        vm.prank(owner);
        campaign.requestTranche("Tranche", 0.5 ether, payable(owner));

        vm.prank(owner);
        campaign.voteForTranche(0, true);

        // Verify still in voting
        assertTrue(campaign.getAllTranches()[0].state == Campaign.TrancheState.Voting);

        vm.prank(owner);
        vm.expectRevert("You have already voted for this tranche");
        campaign.voteForTranche(0, true);
    }

    /// @notice Test if requesting tranche with insufficient funds reverts
    function testRevert_RequestTranche_InsufficientFunds() public {
        campaign.fund{value: 10 ether}(); // Fund to reach Distributing

        vm.prank(owner);
        vm.expectRevert("Not enough funds left to tranche");
        campaign.requestTranche("Too Big", 11 ether, payable(owner));
    }

    /// @notice Test refund functionality when campaign fails
    function test_Refund_CampaignFailed() public {
        address backer = makeAddr("backer");
        vm.deal(backer, 5 ether);

        vm.startPrank(backer);
        campaign.fund{value: 1 ether}();
        vm.stopPrank();

        // Expire campaign without reaching goal (goal is 10 ether)
        vm.warp(campaignStart + campaignDuration + 1);

        assertTrue(campaign.state() == Campaign.CampaignState.Failed);

        vm.startPrank(backer);
        uint256 balanceBefore = backer.balance;
        campaign.refund();
        uint256 balanceAfter = backer.balance;

        assertEq(balanceAfter - balanceBefore, 1 ether);
        assertEq(campaign.backersRaises(backer), 0);
        vm.stopPrank();
    }

    /// @notice Test if refund reverts when campaign is not failed
    function testRevert_Refund_BeforeFail() public {
        address backer = makeAddr("backer");
        vm.deal(backer, 1 ether);
        vm.prank(backer);
        campaign.fund{value: 1 ether}();

        vm.prank(backer);
        vm.expectRevert("Current state does not allow this action");
        campaign.refund();
    }

    /// @notice Test exact boundary transition to Distributing
    function test_DistributingState_Boundary() public {
        // Goal is 10 ether. Fund exactly 10 ether.
        campaign.fund{value: 10 ether}();
        // Should be Distributing immediately
        assertTrue(campaign.state() == Campaign.CampaignState.Distributing);

        // If we fund 9.99 ether it should still be Fundraising (assuming time hasn't passed)
        // New campaign for isolation
        Campaign c2 = new Campaign("C2", 10 ether, 1 days, owner);
        c2.fund{value: 9.99 ether}();
        assertTrue(c2.state() == Campaign.CampaignState.Fundraising);
    }

    /// @notice Test that executing a tranche actually moves ETH to recipient
    function test_TrancheExecution_TransfersEther() public {
        campaign.fund{value: 10 ether}();

        address payable recipient = payable(makeAddr("recipient"));
        uint256 trancheAmount = 1 ether;

        vm.prank(owner);
        campaign.requestTranche("Payroll", trancheAmount, recipient);

        uint256 balanceBefore = recipient.balance;

        // Vote to pass
        campaign.voteForTranche(0, true);

        uint256 balanceAfter = recipient.balance;

        assertEq(balanceAfter - balanceBefore, trancheAmount);
        assertEq(campaign.totalDistributed(), trancheAmount);
    }
}
