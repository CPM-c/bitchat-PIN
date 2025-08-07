from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
import uuid

class MiningSession(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    wallet_address: str
    pool_config: Dict[str, str]
    status: str = "stopped"
    start_time: Optional[datetime] = None
    hash_rate: float = 0.0
    total_hashes: int = 0
    shares_found: int = 0
    accepted_shares: int = 0
    rejected_shares: int = 0
    uptime: int = 0

class MiningStats(BaseModel):
    hashRate: float
    totalHashes: int
    sharesFound: int
    acceptedShares: int
    rejectedShares: int
    uptime: int
    pmll_optimization: Dict[str, any] = {
        "active": True,
        "memory_usage": 0,
        "efficiency_gain": 0.0
    }

class AntMiner(BaseModel):
    id: int
    position: Dict[str, float]
    status: str  # mining, validating, idle
    hashesComputed: int
    currentHash: str
    temperature: float = 45.0
    nonce_range: Dict[str, int] = {"start": 0, "end": 0}

class BlockInfo(BaseModel):
    height: int
    progress: float
    difficulty: float
    target: str
    reward: float = 3.125
    estimatedTime: str
    hash: Optional[str] = None
    previousHash: Optional[str] = None
    timestamp: Optional[int] = None

class PoolStatus(BaseModel):
    connected: bool
    name: str = "Braiins Pool"
    url: str
    ping: int
    difficulty: int
    blocks_found: int
    hashrate: str
    miners: int
    luck: str
    fee: str = "2.5%"

class WalletInfo(BaseModel):
    address: str
    balance: float
    pendingBalance: float
    totalEarned: float
    last_payout: Optional[datetime] = None

class MiningRequest(BaseModel):
    wallet_address: str
    pool_config: Optional[Dict[str, str]] = None

class StopMiningRequest(BaseModel):
    session_id: str