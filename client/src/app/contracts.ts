export const CAMPAIGN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
export const CAMPAIGN_FACTORY_ADDRESS = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0"
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