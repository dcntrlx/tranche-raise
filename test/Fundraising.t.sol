// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Campaign.sol";

contract FundraisingTest is Test {
    Campaign campaign;
    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        campaign = new Campaign();
    }

    function testContributeAndBalance() public {
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);

        vm.prank(alice);
        campaign.contribute{value: 1 ether}();

        vm.prank(bob);
        campaign.contribute{value: 2 ether}();

        (address[] memory addrs, uint256[] memory bals) = campaign.getContributors();
        assertEq(addrs.length, 2);
        assertEq(bals[0], 1 ether);
        assertEq(bals[1], 2 ether);

        assertEq(address(campaign).balance, 3 ether);
    }

    function testCannotContributeZero() public {
        vm.prank(alice);
        vm.expectRevert("Contribution must be > 0");
        campaign.contribute{value: 0}();
    }
}
