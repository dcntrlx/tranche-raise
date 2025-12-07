// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Campaign {
    address public manager;
    uint256 public totalContributions;
    uint256 public tvl;

    struct Request {
        string description;
        uint256 amount;
        address payable recipient;
        uint256 yesVotes;
        bool completed;
        mapping(address => bool) voted;
    }

    Request[] public requests;
    mapping(address => uint256) public contributions;
    address[] public contributorsList;

    constructor() {
        manager = msg.sender;
    }

    function contribute() external payable {
        require(msg.value > 0, "Contribution must be > 0");

        if (contributions[msg.sender] == 0) {
            contributorsList.push(msg.sender);
        }

        contributions[msg.sender] += msg.value;
        totalContributions += msg.value;
        tvl += msg.value;
    }

    function createRequest(
        string memory description,
        uint256 amount,
        address payable recipient
    ) external {
        require(msg.sender == manager, "Only manager can call");
        require(amount > 0, "Cant creat Recuest x <= 0");

        Request storage r = requests.push();
        r.description = description;
        r.amount = amount;
        r.recipient = recipient;
    }

    function approveRequest(uint256 index) external {
        Request storage r = requests[index];
        require(!r.completed, "Completed");
        require(contributions[msg.sender] > 0, "Not contributor");
        require(!r.voted[msg.sender], "Already approved");

        r.voted[msg.sender] = true;
        uint256 weight = (contributions[msg.sender] * 1e18) / tvl;
        r.yesVotes += weight;
    }

    function finalizeRequest(uint256 index) external {
        require(msg.sender == manager, "Only manager");

        Request storage r = requests[index];
        require(!r.completed, "Completed");
        require(r.amount <= tvl, "Not enough TVL");
        require(r.yesVotes >= (1e18 / 2),"Not enough approvals");

        r.completed = true;
        tvl -= r.amount;
        r.recipient.transfer(r.amount);
    }

    // Возвращает реквесты по диапазону
function getRequestsRange(uint256 start, uint256 end)
    external
    view
    returns (
        string[] memory desc,
        uint256[] memory amounts,
        address[] memory recips,
        bool[] memory completed
    )
{
    uint256 len = requests.length;

    if (start >= len) {
        // возвращаем пустые массиtouвы
        return (
            new string[](0) ,
            new uint256[](0) ,
            new address[](0) ,
            new bool[](0) 
        );
    }

    if (end > len) end = len;
    uint256 count = end - start;

    desc = new string[](count);
    amounts = new uint256[](count);
    recips = new address[](count);
    completed = new bool[](count);

    for (uint256 i = 0; i < count; i++) {
        Request storage r = requests[start + i];
        desc[i] = r.description;
        amounts[i] = r.amount;
        recips[i] = r.recipient;
        completed[i] = r.completed;
    }
}


    // Список всех донаторов
    function getContributors()
        external
        view
        returns (address[] memory addrs, uint256[] memory bals)
    {
        uint256 len = contributorsList.length;
        addrs = new address[](len);
        bals = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            address a = contributorsList[i];
            addrs[i] = a;
            bals[i] = contributions[a];
        }
    }

    // Топ донаторов (фронт сортирует)
    function getRawTopDonors()
        external
        view
        returns (address[] memory addrs, uint256[] memory bals)
    {
        uint256 len = contributorsList.length;
        addrs = new address[](len);
        bals = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            address a = contributorsList[i];
            addrs[i] = a;
            bals[i] = contributions[a];
        }
    }

    function getRequestsCount() external view returns (uint256) {
        return requests.length;
    }
        function getTopContributors(uint256 n)
        external
        view
        returns (address[] memory topAddrs, uint256[] memory topAmts)
    {
        uint256 len = contributorsList.length;

        if (n > len) n = len;

        // Получаем копию всех донаторов
        topAddrs = new address[](len);
        topAmts = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            address a = contributorsList[i];
            topAddrs[i] = a;
            topAmts[i] = contributions[a];
        }

        // Сортировка пузырьком (только view → бесплатно)
        for (uint256 i = 0; i < len; i++) {
            for (uint256 j = i + 1; j < len; j++) {
                if (topAmts[j] > topAmts[i]) {
                    // swap amounts
                    uint256 tmpAmt = topAmts[i];
                    topAmts[i] = topAmts[j];
                    topAmts[j] = tmpAmt;

                    // swap addrs
                    address tmpAddr = topAddrs[i];
                    topAddrs[i] = topAddrs[j];
                    topAddrs[j] = tmpAddr;
                }
            }
        }

        // Обрезаем массивы до N
        assembly {
            mstore(topAddrs, n)
            mstore(topAmts, n)
        }
    }

}
