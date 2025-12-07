pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Campaign.sol";

contract FinalizeTest is Test {
    Campaign campaign;
    address manager;
    address alice;

    function setUp() public {
        manager = address(this);          // Деплой контракта
        alice = makeAddr("Alice");        // Создаём "реальный" адрес Alice

        campaign = new Campaign();

        // Выдаем Alice 10 ETH
        vm.deal(alice, 10 ether);

        // Alice вносит 2 ETH
        vm.prank(alice);
        campaign.contribute{value: 2 ether}();

        // Менеджер создаёт реквест на 1 ETH для Alice
        campaign.createRequest("Buy stuff", 1 ether, payable(alice));
    }

    function testFinalizeRequestWorks() public {
        // Alice голосует за реквест
        vm.prank(alice);
        campaign.approveRequest(0);

        // Менеджер финализирует реквест
        campaign.finalizeRequest(0);

        // Проверяем, что реквест выполнен и recipient правильный
        (string[] memory desc, uint256[] memory amounts, address[] memory recips, bool[] memory done) = campaign.getRequestsRange(0, 1);

        assertEq(recips[0], alice);
        assertTrue(done[0]);
        assertEq(amounts[0], 1 ether);
        assertEq(desc[0], "Buy stuff");
    }
}
