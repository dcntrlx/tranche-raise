// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Campaign.sol";

contract VotingTest is Test {
    Campaign campaign;
    address manager = address(this);
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

        campaign.createRequest("Buy stuff", 2 ether, payable(alice));
    }

    function testContributorCanVote() public {
        vm.prank(alice);
        campaign.approveRequest(0);

        // нельзя проголосовать дважды
        vm.prank(alice);
        vm.expectRevert("Already approved");
        campaign.approveRequest(0);
    }
}
