//SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

/// @title Campaign
/// @author dnctrlx
/// @notice This contract represent single campaign itselff
contract Campaign {
    address public immutable owner;
    string public campaignTitle;
    uint256 public immutable campaignGoal;
    uint256 public immutable campaignDuration;
    uint256 public campaignStart;
    uint256 public campaignEnd; // campaignEnd = block.timestamp + campaignDuration; used instead summ to optimize storage reading for cold slots

    mapping(address => uint256) public backersRaises;
    address[] public backers;

    constructor(string memory _campaignTitle, uint256 _campaignGoal, uint256 _campaignDuration) {
        owner = msg.sender;
        campaignTitle = _campaignTitle;
        campaignGoal = _campaignGoal;
        campaignDuration = _campaignDuration;
        campaignStart = block.timestamp;
        campaignEnd = block.timestamp + campaignDuration;
    }

    function isActive() public view returns (bool) {
        return block.timestamp < campaignEnd;
    }

    modifier onlyActive() {
        require(isActive(), "You can't fundraise because this campaign already ended");
        _;
    }

    function fund() external payable onlyActive {
        if (backersRaises[msg.sender] == 0) {
            backers.push(msg.sender);
        }
        backersRaises[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external onlyActive {
        require(backersRaises[msg.sender] >= amount, "You havent' raised this many");
        backersRaises[msg.sender] -= amount;
        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }
}
