export const CAMPAIGN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
export const CAMPAIGN_ABI = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "_campaignTitle",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "_campaignGoal",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_campaignDuration",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_owner",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "CAMPAIGN_DURATION",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "CAMPAIGN_GOAL",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "OWNER",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "backers",
        "inputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "backersRaises",
        "inputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "campaignEnd",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "campaignStart",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "campaignTitle",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "string",
                "internalType": "string"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "fund",
        "inputs": [],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "refund",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "requestTranche",
        "inputs": [
            {
                "name": "_trancheName",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "_trancheAmount",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_recepint",
                "type": "address",
                "internalType": "address payable"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "state",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint8",
                "internalType": "enum Campaign.CampaignState"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "totalDistributed",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "totalRaised",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "tranches",
        "inputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "trancheName",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "trancheAmount",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "votesFor",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "votesAgainst",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "recepient",
                "type": "address",
                "internalType": "address payable"
            },
            {
                "name": "state",
                "type": "uint8",
                "internalType": "enum Campaign.TrancheState"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "voteForTranche",
        "inputs": [
            {
                "name": "_trancheIndex",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_voteFor",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "withdraw",
        "inputs": [
            {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    }
] as const

export const CAMPAIGN_FACTORY_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
export const SUPPORTED_NETWORKS = ["localhost"]
export const CAMPAIGN_FACTORY_ABI = [
    {
        "type": "constructor",
        "inputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "campaigns",
        "inputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "createCampaign",
        "inputs": [
            {
                "name": "_campaignTitle",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "_campaignGoal",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_campaignDuration",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getAllCampaigns",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address[]",
                "internalType": "address[]"
            }
        ],
        "stateMutability": "view"
    }
] as const