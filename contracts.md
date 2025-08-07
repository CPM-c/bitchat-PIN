# Bitcoin Ant Colony Miner - API Contracts & Implementation Plan

## Overview
Real Bitcoin mining application with animated ant colony interface, using PMLL algorithm optimization and Braiins Pool connectivity.

## API Contracts

### 1. Mining Control Endpoints

#### POST /api/mining/start
```json
Request: {
  "wallet_address": "string", 
  "pool_config": {
    "url": "stratum+tcp://stratum.braiins.com:3333",
    "username": "worker_name",
    "password": "worker_password"
  }
}
Response: {
  "status": "mining_started",
  "session_id": "uuid",
  "estimated_hashrate": "number"
}
```

#### POST /api/mining/stop
```json
Request: { "session_id": "uuid" }
Response: { "status": "mining_stopped", "final_stats": "object" }
```

### 2. Real-time Mining Data

#### GET /api/mining/stats/{session_id}
```json
Response: {
  "hashRate": "number (H/s)",
  "totalHashes": "number", 
  "sharesFound": "number",
  "acceptedShares": "number",
  "rejectedShares": "number",
  "uptime": "number (seconds)",
  "pmll_optimization": {
    "active": "boolean",
    "memory_usage": "number (MB)",
    "efficiency_gain": "number (%)"
  }
}
```

#### GET /api/mining/ants/{session_id}
```json
Response: {
  "ants": [
    {
      "id": "number",
      "position": {"x": "number", "y": "number"},
      "status": "mining|validating|idle",
      "hashesComputed": "number",
      "currentHash": "string",
      "temperature": "number"
    }
  ]
}
```

### 3. Block & Pool Information

#### GET /api/blockchain/current-block
```json
Response: {
  "height": "number",
  "progress": "number (0-100)",
  "difficulty": "number",
  "target": "string (hex)",
  "reward": "number (BTC)",
  "estimatedTime": "string"
}
```

#### GET /api/pool/status
```json
Response: {
  "connected": "boolean",
  "name": "Braiins Pool",
  "url": "string",
  "ping": "number (ms)",
  "difficulty": "number",
  "blocks_found": "number"
}
```

### 4. Wallet & Earnings

#### GET /api/wallet/balance/{address}
```json
Response: {
  "address": "string",
  "balance": "number (BTC)",
  "pendingBalance": "number (BTC)", 
  "totalEarned": "number (BTC)",
  "last_payout": "datetime"
}
```

## Mock Data Replacement Plan

### Current Mock Data in frontend/src/data/mock.js:
- `initialStats` → Replace with real-time API calls to `/api/mining/stats`
- `currentBlock` → Replace with `/api/blockchain/current-block`
- `ants` → Replace with `/api/mining/ants` 
- `walletInfo` → Replace with `/api/wallet/balance`
- `poolStats` → Replace with `/api/pool/status`

## Backend Implementation Requirements

### 1. Real Bitcoin Mining Engine
- **SHA-256 Hash Computing**: Implement actual Bitcoin block header hashing
- **PMLL Integration**: Use PMLL.c algorithm for hash optimization
- **Stratum Protocol**: Connect to Braiins Pool via Stratum mining protocol
- **Nonce Space Management**: Distribute nonce ranges across 8 virtual "ants"
- **Share Validation**: Verify and submit valid shares to pool

### 2. PMLL Algorithm Integration
```python
# PMLL integration for optimized mining
from pmll_wrapper import PMLL

class PMLLMiningOptimizer:
    def __init__(self):
        self.pmll = PMLL()
        
    def optimize_nonce_search(self, block_header, target, start_nonce):
        # Use PMLL algorithm for polynomial-time nonce discovery
        return self.pmll.find_optimal_nonce(block_header, target, start_nonce)
```

### 3. Ant Colony Simulation
- Each ant represents a mining thread
- Distribute nonce ranges across 8 ants
- Track individual ant performance
- Simulate ant positions based on hash progress

### 4. Real Cryptocurrency Components
- **Bitcoin Network Connection**: Real blockchain data via RPC
- **Braiins Pool Integration**: Actual stratum connection
- **Wallet Integration**: Real Bitcoin address monitoring
- **Transaction Broadcasting**: Submit winning blocks to network

### 5. WebSocket Real-time Updates
```python
# WebSocket for real-time mining updates
@app.websocket("/ws/mining/{session_id}")
async def mining_websocket(websocket: WebSocket, session_id: str):
    # Stream live mining data every second
    # Update ant positions, hash rates, share findings
```

## Security Considerations
- **API Keys**: Store pool credentials in environment variables
- **Wallet Security**: Never store private keys, only monitor addresses
- **Rate Limiting**: Prevent abuse of mining endpoints
- **Input Validation**: Validate all Bitcoin addresses and pool configurations

## Frontend Integration Changes
1. Replace mock data imports with API calls
2. Add WebSocket connection for real-time updates  
3. Add error handling for mining failures
4. Implement loading states during API calls

## Testing Strategy
1. **Unit Tests**: Test PMLL algorithm integration
2. **Integration Tests**: Test Braiins Pool connectivity  
3. **Performance Tests**: Measure actual hash rate performance
4. **End-to-End Tests**: Full mining session simulation

## Deployment Notes
- Requires significant CPU/GPU resources for real mining
- Monitor temperature and power consumption
- Implement automatic shutdown on hardware overheating
- Set reasonable hash rate expectations (CPU mining is not profitable)