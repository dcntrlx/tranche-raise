export const CAMPAIGN_FACTORY_ADDRESSES: Record<number, `0x${string}`> = {
    42161: (process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR_42161 as `0x${string}`) || "0xcaf0c4fde258cb8fb3b0766cd071bc4244f4ca50", // Arbitrum
    1329: (process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR_1329 as `0x${string}`), // Sei
};

export const CAMPAIGN_FACTORY_ABI = [
    {
        "type": "constructor",
        "inputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "campaignImplementation",
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
                "name": "_metadataCID",
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
    },
    {
        "type": "error",
        "name": "FailedDeployment",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InsufficientBalance",
        "inputs": [
            {
                "name": "balance",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "needed",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    }
] as const

export const CAMPAIGN_ABI = [
    {
        "type": "constructor",
        "inputs": [],
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
        "name": "isCancelled",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "cancelledBalance",
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
        "name": "cancelVotes",
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
        "name": "votedToCancel",
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
                "type": "bool",
                "internalType": "bool"
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
        "name": "metadataCID",
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
        "name": "revokeFunds",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "voteToCancel",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getAllTranches",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "tuple[]",
                "internalType": "struct Campaign.TrancheView[]",
                "components": [
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
                        "internalType": "address"
                    },
                    {
                        "name": "state",
                        "type": "uint8",
                        "internalType": "enum Campaign.TrancheState"
                    }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "initialize",
        "inputs": [
            {
                "name": "_campaignTitle",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "_metadataCID",
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
        "outputs": [],
        "stateMutability": "nonpayable"
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
        "type": "event",
        "name": "Initialized",
        "inputs": [
            {
                "name": "version",
                "type": "uint64",
                "indexed": false,
                "internalType": "uint64"
            }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "InvalidInitialization",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotInitializing",
        "inputs": []
    }
] as const