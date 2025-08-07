import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

class MiningAPI {
  constructor() {
    this.currentSession = null;
  }

  async startMining(walletAddress) {
    try {
      const response = await axios.post(`${API}/mining/start`, {
        wallet_address: walletAddress,
        pool_config: {
          url: "stratum.braiins.com",
          port: "3333",
          username: "ant_colony_miner.001",
          password: "x"
        }
      });
      
      if (response.data.session_id) {
        this.currentSession = response.data.session_id;
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to start mining:', error);
      throw error;
    }
  }

  async stopMining() {
    if (!this.currentSession) {
      throw new Error('No active mining session');
    }

    try {
      const response = await axios.post(`${API}/mining/stop`, {
        session_id: this.currentSession
      });
      
      this.currentSession = null;
      return response.data;
    } catch (error) {
      console.error('Failed to stop mining:', error);
      throw error;
    }
  }

  async getMiningStats() {
    if (!this.currentSession) {
      return null;
    }

    try {
      const response = await axios.get(`${API}/mining/stats/${this.currentSession}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get mining stats:', error);
      return null;
    }
  }

  async getAntStates() {
    if (!this.currentSession) {
      return [];
    }

    try {
      const response = await axios.get(`${API}/mining/ants/${this.currentSession}`);
      return response.data.ants || [];
    } catch (error) {
      console.error('Failed to get ant states:', error);
      return [];
    }
  }

  async getCurrentBlock() {
    try {
      const response = await axios.get(`${API}/blockchain/current-block`);
      return response.data;
    } catch (error) {
      console.error('Failed to get current block:', error);
      return null;
    }
  }

  async getPoolStatus() {
    try {
      const response = await axios.get(`${API}/pool/status`);
      return response.data;
    } catch (error) {
      console.error('Failed to get pool status:', error);
      return null;
    }
  }

  async getWalletBalance(address) {
    try {
      const response = await axios.get(`${API}/wallet/balance/${address}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      return null;
    }
  }

  createWebSocket() {
    if (!this.currentSession) {
      return null;
    }

    const wsUrl = `ws://localhost:8001/api/mining/ws/${this.currentSession}`;
    return new WebSocket(wsUrl);
  }

  getSessionId() {
    return this.currentSession;
  }

  hasActiveSession() {
    return this.currentSession !== null;
  }
}

export const miningAPI = new MiningAPI();