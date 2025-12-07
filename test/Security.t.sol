// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Campaign.sol";

contract SecurityTest is Test {
    Campaign campaign;
    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        campaign = new Campaign();
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);

        vm.prank(alice);
        campaign.contribute{value: 1 ether}();
        vm.prank(bob);
        campaign.contribute{value: 2 ether}();
    }

    function testCannotWithdrawWithoutApproval() public {
        campaign.createRequest("Buy stuff", 1 ether, payable(alice));
        vm.expectRevert("Not enough approvals");
        campaign.finalizeRequest(0);
    }

    function testDoubleVotingBlocked() public {
        campaign.createRequest("Buy stuff", 1 ether, payable(alice));

        vm.prank(alice);
        campaign.approveRequest(0);

        vm.prank(alice);
        vm.expectRevert("Already approved");
        campaign.approveRequest(0);
    }
}
