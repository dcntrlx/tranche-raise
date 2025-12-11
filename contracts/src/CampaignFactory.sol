// SPDX-License-Identifier: MIT

import {Campaign} from "./Campaign.sol";

pragma solidity ^0.8.24;

contract CampaignFactory {
    address[] public campaigns;
    mapping(address => bool) public isCampaignCreated;

    constructor() {}

    function createCampaign(string memory _campaignTitle, uint256 _campaignGoal, uint256 _campaignDuration) external {
        Campaign campaign = new Campaign(_campaignTitle, _campaignGoal, _campaignDuration, msg.sender);
        campaigns.push(address(campaign));
        isCampaignCreated[address(campaign)] = true;
    }

    function getAllCampaigns() external view returns (address[] memory) {
        return campaigns;
    }
}
