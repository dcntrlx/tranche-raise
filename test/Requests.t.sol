// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Campaign.sol";

contract RequestsTest is Test {
    Campaign campaign;
    address manager = address(this);
    address alice = address(0x1);

    function setUp() public {
        campaign = new Campaign();
    }

    function testOnlyManagerCanCreateRequest() public {
        vm.expectRevert("Only manager can call");
        vm.prank(alice);
        campaign.createRequest("Buy stuff", 1 ether, payable(alice));
    }

    function testRequestDataStoredCorrectly() public {
        campaign.createRequest("Buy stuff", 1 ether, payable(alice));
        (string[] memory desc,, address[] memory recips, bool[] memory done) = campaign.getRequestsRange(0, 1);

        assertEq(desc[0], "Buy stuff");
        assertEq(recips[0], alice);
        assertEq(done[0], false);
    }
}
