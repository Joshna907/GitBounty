// testBounties.js
export const testBounties = [
  {
    id: 1,
    name: "Pinto",
    description: "Pinto smart contracts bounty program for DeFi security.",
    tags: ["DeFi", "Smart Contract", "Security"],
    metrics: {
      maxBounty: "$5,000",
      liveSince: "01/01/2024",
      lastUpdated: "10/11/2025"
    },
    features: ["Audited", "Verified", "High Priority"],
    vault: {
      fundsAvailable: "$50,000",
      avg30d: "$12,500",
      assetsInVault: "ETH, USDC",
      vaultAddress: "0x123...abc"
    },
    tabs: {
      information: "This bounty focuses on vulnerabilities in the PintoToken and PintoStaking contracts.",
      scope: [
        { type: "Contract", name: "PintoToken", addedOn: "01/01/2024" },
        { type: "Contract", name: "PintoStaking", addedOn: "05/01/2024" }
      ],
      outOfScope: ["Frontend", "Marketing Contracts"],
      resources: [
        { label: "Audit Report", url: "#" },
        { label: "Documentation", url: "#" }
      ]
    }
  },
  {
    id: 2,
    name: "LlamaSwap",
    description: "LlamaSwap bug bounty focusing on AMM contracts.",
    tags: ["DeFi", "AMM", "Security"],
    metrics: {
      maxBounty: "$3,500",
      liveSince: "03/02/2024",
      lastUpdated: "11/10/2025"
    },
    features: ["Audited", "Verified"],
    vault: {
      fundsAvailable: "$30,000",
      avg30d: "$8,000",
      assetsInVault: "ETH, USDT",
      vaultAddress: "0xabc...456"
    },
    tabs: {
      information: "LlamaSwap program rewards issues in AMM smart contracts.",
      scope: [
        { type: "Contract", name: "LlamaToken", addedOn: "03/02/2024" },
        { type: "Contract", name: "SwapRouter", addedOn: "04/02/2024" }
      ],
      outOfScope: ["Website Frontend", "Marketing Contracts"],
      resources: [
        { label: "Audit Report", url: "#" },
        { label: "Docs", url: "#" }
      ]
    }
  },
  {
    id: 3,
    name: "TigerFi",
    description: "TigerFi DeFi protocol bounty focusing on staking contracts.",
    tags: ["DeFi", "Staking", "Security"],
    metrics: {
      maxBounty: "$4,000",
      liveSince: "15/03/2024",
      lastUpdated: "09/11/2025"
    },
    features: ["Verified", "High Priority"],
    vault: {
      fundsAvailable: "$40,000",
      avg30d: "$10,000",
      assetsInVault: "ETH, DAI",
      vaultAddress: "0xdef...789"
    },
    tabs: {
      information: "TigerFi rewards vulnerabilities in staking and reward contracts.",
      scope: [
        { type: "Contract", name: "TigerStaking", addedOn: "15/03/2024" }
      ],
      outOfScope: ["Frontend", "Marketing Contracts"],
      resources: [
        { label: "Docs", url: "#" }
      ]
    }
  },
  {
    id: 4,
    name: "FalconChain",
    description: "FalconChain bounty program targeting security in governance contracts.",
    tags: ["Blockchain", "Governance", "Security"],
    metrics: {
      maxBounty: "$6,000",
      liveSince: "20/04/2024",
      lastUpdated: "12/11/2025"
    },
    features: ["Audited", "High Priority"],
    vault: {
      fundsAvailable: "$60,000",
      avg30d: "$15,000",
      assetsInVault: "ETH, USDC, USDT",
      vaultAddress: "0xghi...101"
    },
    tabs: {
      information: "FalconChain program focuses on governance contract vulnerabilities.",
      scope: [
        { type: "Contract", name: "FalconGovernance", addedOn: "20/04/2024" }
      ],
      outOfScope: ["Frontend", "Marketing Contracts"],
      resources: [
        { label: "Audit Report", url: "#" },
        { label: "Docs", url: "#" }
      ]
    }
  }
];
