// Mock data for Bitcoin ant miner
export const mockMiningData = {
  initialStats: {
    hashRate: 125.8, // H/s
    totalHashes: 0,
    sharesFound: 0,
    acceptedShares: 0,
    rejectedShares: 0,
    uptime: 0
  },
  
  currentBlock: {
    height: 872451,
    progress: 23.7,
    difficulty: 95.67,
    target: "00000000000000000008a7c5f0e1b2d3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
    reward: 3.125,
    estimatedTime: "8m 32s"
  },

  ants: [
    {
      id: 1,
      position: { x: 15, y: 20 },
      status: 'mining',
      hashesComputed: 1245,
      currentHash: 'a7f3e2d1c8b9a6f5'
    },
    {
      id: 2,
      position: { x: 35, y: 45 },
      status: 'mining',
      hashesComputed: 967,
      currentHash: 'f8e4d7c3b2a9f6e1'
    },
    {
      id: 3,
      position: { x: 55, y: 25 },
      status: 'validating',
      hashesComputed: 1876,
      currentHash: 'c9f2e5a8d7b4c1f6'
    },
    {
      id: 4,
      position: { x: 75, y: 65 },
      status: 'mining',
      hashesComputed: 2134,
      currentHash: 'b3e7f1a4d8c5b9e2'
    },
    {
      id: 5,
      position: { x: 25, y: 75 },
      status: 'idle',
      hashesComputed: 543,
      currentHash: 'd6a9f4e7c2b5a8f1'
    },
    {
      id: 6,
      position: { x: 65, y: 40 },
      status: 'mining',
      hashesComputed: 1654,
      currentHash: 'e5c8f3a6d9b7e4c1'
    },
    {
      id: 7,
      position: { x: 45, y: 80 },
      status: 'mining',
      hashesComputed: 876,
      currentHash: 'f2a5d8c1b6f9e3a7'
    },
    {
      id: 8,
      position: { x: 85, y: 30 },
      status: 'validating',
      hashesComputed: 1432,
      currentHash: 'a8f5c2e9d6b3f7a4'
    }
  ],

  walletInfo: {
    address: "bc1q[placeholder_wallet_address_here]",
    balance: 0.00000000,
    pendingBalance: 0.00001247,
    totalEarned: 0.00312784
  },

  poolStats: {
    name: 'Braiins Pool',
    hashrate: '45.2 EH/s',
    miners: 28534,
    blocks: 15247,
    luck: '102.3%',
    fee: '2.5%'
  }
};