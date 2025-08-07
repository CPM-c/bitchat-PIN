import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import AntMinerAnimation from './AntMinerAnimation';
import MiningStats from './MiningStats';
import PoolConnection from './PoolConnection';
import { miningAPI } from '../api/miningAPI';
import { useToast } from '../hooks/use-toast';
import { Activity, Zap, Users, Coins } from 'lucide-react';

const MiningDashboard = () => {
  const [ismining, setIsMining] = useState(false);
  const [miningStats, setMiningStats] = useState({
    hashRate: 0,
    totalHashes: 0,
    sharesFound: 0,
    acceptedShares: 0,
    rejectedShares: 0,
    uptime: 0,
    pmll_optimization: {
      active: "false",
      memory_usage: "0",
      efficiency_gain: "0.0"
    }
  });
  const [ants, setAnts] = useState([]);
  const [currentBlock, setCurrentBlock] = useState({
    height: 0,
    progress: 0,
    difficulty: 0,
    target: "",
    reward: 3.125,
    estimatedTime: ""
  });
  const [poolStatus, setPoolStatus] = useState({
    connected: false,
    name: "Braiins Pool",
    url: "",
    ping: 0,
    difficulty: 0
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const walletAddress = "bc1qr4tvstras40rdsdxhxer2c2x5nzuukk7araea5";

  // Fetch blockchain data periodically
  const fetchBlockchainData = useCallback(async () => {
    try {
      const blockData = await miningAPI.getCurrentBlock();
      if (blockData) {
        setCurrentBlock(blockData);
      }

      const poolData = await miningAPI.getPoolStatus();
      if (poolData) {
        setPoolStatus(poolData);
      }
    } catch (error) {
      console.error('Failed to fetch blockchain data:', error);
    }
  }, []);

  // Fetch mining data when mining is active
  const fetchMiningData = useCallback(async () => {
    if (!ismining || !miningAPI.hasActiveSession()) return;

    try {
      const [statsData, antsData] = await Promise.all([
        miningAPI.getMiningStats(),
        miningAPI.getAntStates()
      ]);

      if (statsData) {
        setMiningStats(statsData);
      }

      if (antsData) {
        setAnts(antsData);
      }
    } catch (error) {
      console.error('Failed to fetch mining data:', error);
    }
  }, [ismining]);

  // Initialize data on component mount
  useEffect(() => {
    fetchBlockchainData();
    
    // Set up intervals for data fetching
    const blockchainInterval = setInterval(fetchBlockchainData, 10000); // Every 10 seconds
    const miningInterval = setInterval(fetchMiningData, 1000); // Every second when mining

    return () => {
      clearInterval(blockchainInterval);
      clearInterval(miningInterval);
    };
  }, [fetchBlockchainData, fetchMiningData]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    let ws = null;

    if (ismining && miningAPI.hasActiveSession()) {
      try {
        ws = miningAPI.createWebSocket();
        
        if (ws) {
          ws.onopen = () => {
            console.log('🐜 WebSocket connected for real-time mining data');
          };

          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              
              if (data.stats) {
                setMiningStats(data.stats);
              }
              
              if (data.ants) {
                setAnts(data.ants);
              }
              
              if (data.block) {
                setCurrentBlock(prev => ({ ...prev, ...data.block }));
              }
              
              if (data.pool_status) {
                setPoolStatus(data.pool_status);
              }
            } catch (error) {
              console.error('WebSocket message parsing error:', error);
            }
          };

          ws.onerror = (error) => {
            console.error('WebSocket error:', error);
          };

          ws.onclose = () => {
            console.log('WebSocket disconnected');
          };
        }
      } catch (error) {
        console.error('Failed to create WebSocket:', error);
      }
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ismining]);

  const handleStartMining = async () => {
    setLoading(true);
    try {
      const result = await miningAPI.startMining(walletAddress);
      
      setIsMining(true);
      toast({
        title: "Mining Started! 🐜",
        description: result.message || "Bitcoin Ant Colony mining has begun with PMLL optimization!",
        duration: 5000,
      });
      
      // Fetch initial data
      await fetchMiningData();
      
    } catch (error) {
      console.error('Failed to start mining:', error);
      toast({
        title: "Mining Start Failed ❌",
        description: error.response?.data?.detail || "Failed to start mining. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStopMining = async () => {
    setLoading(true);
    try {
      const result = await miningAPI.stopMining();
      
      setIsMining(false);
      toast({
        title: "Mining Stopped ⏹️",
        description: "Mining session terminated successfully",
        duration: 3000,
      });
      
      // Reset states
      setAnts([]);
      setMiningStats({
        hashRate: 0,
        totalHashes: 0,
        sharesFound: 0,
        acceptedShares: 0,
        rejectedShares: 0,
        uptime: 0,
        pmll_optimization: {
          active: "false",
          memory_usage: "0",
          efficiency_gain: "0.0"
        }
      });
      
    } catch (error) {
      console.error('Failed to stop mining:', error);
      toast({
        title: "Stop Mining Failed ❌",
        description: error.response?.data?.detail || "Failed to stop mining.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🐜 Bitcoin Ant Colony Miner
          </h1>
          <p className="text-lg text-gray-600">
            Powered by PMLL & Connected to Braiins Pool
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Wallet: {walletAddress}
          </p>
        </div>

        {/* Mining Control */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Mining Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleStartMining} 
                disabled={ismining || loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Zap className="mr-2 h-4 w-4" />
                {loading ? "Starting..." : "Start Mining"}
              </Button>
              <Button 
                onClick={handleStopMining} 
                disabled={!ismining || loading}
                variant="destructive"
              >
                {loading ? "Stopping..." : "Stop Mining"}
              </Button>
              <Badge variant={ismining ? "default" : "secondary"}>
                {ismining ? "Mining Active" : "Mining Stopped"}
              </Badge>
              {miningAPI.hasActiveSession() && (
                <Badge variant="outline">
                  Session: {miningAPI.getSessionId()?.slice(0, 8)}...
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Block Progress */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Current Block: {currentBlock.height || "Loading..."}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Block Progress</span>
                  <span>{currentBlock.progress?.toFixed(2) || 0}%</span>
                </div>
                <Progress value={currentBlock.progress || 0} className="h-3" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Difficulty</p>
                  <p className="font-mono">{currentBlock.difficulty?.toFixed(2) || "0"}T</p>
                </div>
                <div>
                  <p className="text-gray-500">Target Hash</p>
                  <p className="font-mono text-xs">{currentBlock.target?.slice(0, 20) || "Loading..."}...</p>
                </div>
                <div>
                  <p className="text-gray-500">Reward</p>
                  <p className="font-semibold">{currentBlock.reward || 3.125} BTC</p>
                </div>
                <div>
                  <p className="text-gray-500">Time Left</p>
                  <p className="font-semibold">{currentBlock.estimatedTime || "Calculating..."}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ant Animation */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Ant Miners ({ants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AntMinerAnimation 
                ants={ants}
                ismining={ismining}
              />
            </CardContent>
          </Card>

          {/* Mining Statistics */}
          <div className="space-y-6">
            <MiningStats stats={miningStats} />
            <PoolConnection poolStatus={poolStatus} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiningDashboard;