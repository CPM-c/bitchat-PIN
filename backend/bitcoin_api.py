import aiohttp
import asyncio
from typing import Dict, Optional
import json
import logging

class BitcoinAPI:
    """
    Bitcoin blockchain API client for real blockchain data
    Uses multiple API providers for reliability
    """
    
    def __init__(self):
        self.session = None
        self.logger = logging.getLogger(__name__)
        
        # API endpoints
        self.apis = [
            "https://blockstream.info/api",
            "https://mempool.space/api",
            "https://api.blockcypher.com/v1/btc/main"
        ]
        self.current_api = 0
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def _make_request(self, endpoint: str) -> Optional[Dict]:
        """Make HTTP request with fallback to different APIs"""
        if not self.session:
            self.session = aiohttp.ClientSession()
        
        for api_base in self.apis:
            try:
                url = f"{api_base}/{endpoint}"
                async with self.session.get(url, timeout=10) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        self.logger.warning(f"API {api_base} returned {response.status}")
            except Exception as e:
                self.logger.error(f"API request failed for {api_base}: {e}")
                continue
        
        return None
    
    async def get_current_block_height(self) -> Optional[int]:
        """Get current Bitcoin block height"""
        try:
            # Try blockstream.info first
            data = await self._make_request("blocks/tip/height")
            if data is not None:
                return int(data) if isinstance(data, (str, int)) else data
            
            # Try mempool.space
            data = await self._make_request("blocks/tip/height")
            if data:
                return data
                
        except Exception as e:
            self.logger.error(f"Failed to get block height: {e}")
        
        return None
    
    async def get_block_info(self, block_hash: Optional[str] = None) -> Optional[Dict]:
        """Get block information"""
        try:
            if not block_hash:
                # Get latest block
                endpoint = "blocks/tip/hash"
                block_hash = await self._make_request(endpoint)
                if not block_hash:
                    return None
            
            # Get block details
            endpoint = f"block/{block_hash}"
            block_data = await self._make_request(endpoint)
            
            if block_data:
                return {
                    "height": block_data.get("height", 0),
                    "hash": block_data.get("id", ""),
                    "previousHash": block_data.get("previousblockhash", ""),
                    "merkleRoot": block_data.get("merkle_root", ""),
                    "timestamp": block_data.get("timestamp", 0),
                    "difficulty": block_data.get("difficulty", 0),
                    "bits": block_data.get("bits", ""),
                    "size": block_data.get("size", 0),
                    "tx_count": block_data.get("tx_count", 0)
                }
        
        except Exception as e:
            self.logger.error(f"Failed to get block info: {e}")
        
        return None
    
    async def get_mining_info(self) -> Optional[Dict]:
        """Get current Bitcoin network mining information"""
        try:
            # Use blockcypher API for mining stats
            async with self.session.get("https://api.blockcypher.com/v1/btc/main", timeout=10) as response:
                if response.status == 200:
                    data = await response.json()
                    return {
                        "height": data.get("height", 0),
                        "difficulty": data.get("difficulty", 0),
                        "hash": data.get("hash", ""),
                        "previous_hash": data.get("previous_hash", ""),
                        "time": data.get("time", ""),
                        "unconfirmed_count": data.get("unconfirmed_count", 0)
                    }
        
        except Exception as e:
            self.logger.error(f"Failed to get mining info: {e}")
        
        return None
    
    async def get_difficulty(self) -> Optional[float]:
        """Get current Bitcoin mining difficulty"""
        try:
            # Try to get from multiple sources
            endpoints = [
                "https://blockstream.info/api/blocks/tip",
                "https://mempool.space/api/blocks/tip"
            ]
            
            for endpoint in endpoints:
                try:
                    async with self.session.get(endpoint, timeout=5) as response:
                        if response.status == 200:
                            data = await response.json()
                            difficulty = data.get("difficulty")
                            if difficulty:
                                return float(difficulty)
                except:
                    continue
        
        except Exception as e:
            self.logger.error(f"Failed to get difficulty: {e}")
        
        return None
    
    async def get_mempool_info(self) -> Optional[Dict]:
        """Get mempool statistics"""
        try:
            data = await self._make_request("mempool")
            if data:
                return {
                    "count": data.get("count", 0),
                    "vsize": data.get("vsize", 0),
                    "total_fee": data.get("total_fee", 0),
                    "fee_histogram": data.get("fee_histogram", [])
                }
        
        except Exception as e:
            self.logger.error(f"Failed to get mempool info: {e}")
        
        return None
    
    async def check_wallet_balance(self, address: str) -> Optional[Dict]:
        """Check Bitcoin wallet balance and transactions"""
        try:
            # Get address info from blockstream
            endpoint = f"address/{address}"
            data = await self._make_request(endpoint)
            
            if data:
                # Get transaction history
                tx_endpoint = f"address/{address}/txs"
                tx_data = await self._make_request(tx_endpoint)
                
                balance_satoshi = data.get("chain_stats", {}).get("funded_txo_sum", 0)
                balance_btc = balance_satoshi / 100000000  # Convert to BTC
                
                return {
                    "address": address,
                    "balance": balance_btc,
                    "balance_satoshi": balance_satoshi,
                    "tx_count": data.get("chain_stats", {}).get("tx_count", 0),
                    "received": data.get("chain_stats", {}).get("funded_txo_sum", 0) / 100000000,
                    "spent": data.get("chain_stats", {}).get("spent_txo_sum", 0) / 100000000,
                    "transactions": tx_data[:10] if tx_data else []  # Last 10 transactions
                }
        
        except Exception as e:
            self.logger.error(f"Failed to check wallet balance: {e}")
        
        return None
    
    async def get_network_hashrate(self) -> Optional[float]:
        """Estimate network hash rate"""
        try:
            # Get recent blocks to estimate hashrate
            async with self.session.get("https://mempool.space/api/blocks", timeout=10) as response:
                if response.status == 200:
                    blocks = await response.json()
                    if len(blocks) >= 2:
                        # Calculate based on difficulty and block time
                        latest_block = blocks[0]
                        difficulty = latest_block.get("difficulty", 0)
                        
                        # Approximate network hashrate (hashes per second)
                        # Network hashrate = difficulty * 2^32 / 600 (10 minute target)
                        if difficulty > 0:
                            hashrate = (difficulty * 4294967296) / 600
                            return hashrate
        
        except Exception as e:
            self.logger.error(f"Failed to get network hashrate: {e}")
        
        return None
    
    async def get_price_data(self) -> Optional[Dict]:
        """Get Bitcoin price data"""
        try:
            async with self.session.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd", timeout=5) as response:
                if response.status == 200:
                    data = await response.json()
                    return {
                        "usd": data.get("bitcoin", {}).get("usd", 0)
                    }
        
        except Exception as e:
            self.logger.error(f"Failed to get price data: {e}")
        
        return None

# Global Bitcoin API instance
bitcoin_api = BitcoinAPI()