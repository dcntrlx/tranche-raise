// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Campaign.sol";

contract ContributorsTest is Test {
    Campaign campaign;

    address A = address(0xA1);
    address B = address(0xB1);
    address C = address(0xC1);

    function setUp() public {
        campaign = new Campaign();
    }

    function testTopContributors() public {
        vm.deal(A, 5 ether);
        vm.deal(B, 2 ether);
        vm.deal(C, 1 ether);

        vm.prank(A);
        campaign.contribute{value: 5 ether}();

        vm.prank(B);
        campaign.contribute{value: 2 ether}();

        vm.prank(C);
        campaign.contribute{value: 1 ether}();

        // получаем топ-2
        (address[] memory addrs, uint256[] memory bals) = campaign.getTopContributors(2);

        // Проверка длин
        assertEq(addrs.length, 2);
        assertEq(bals.length, 2);

        // порядок должен быть: A (5 ETH), B (2 ETH)
        assertEq(addrs[0], A);
        assertEq(bals[0], 5 ether);

        assertEq(addrs[1], B);
        assertEq(bals[1], 2 ether);
    }
}
