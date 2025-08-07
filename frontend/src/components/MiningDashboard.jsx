import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import AntMinerAnimation from './AntMinerAnimation';
import MiningStats from './MiningStats';
import PoolConnection from './PoolConnection';
import { mockMiningData } from '../data/mock';
import { Activity, Zap, Users, Coins } from 'lucide-react';

const MiningDashboard = () => {
  const [ismining, setIsMining] = useState(false);
  const [miningStats, setMiningStats] = useState(mockMiningData.initialStats);
  const [ants, setAnts] = useState(mockMiningData.ants);
  const [currentBlock, setCurrentBlock] = useState(mockMiningData.currentBlock);

  useEffect(() => {
    let interval;
    if (ismining) {
      interval = setInterval(() => {
        // Simulate real-time mining updates
        setMiningStats(prev => ({
          ...prev,
          hashRate: prev.hashRate + Math.random() * 10,
          totalHashes: prev.totalHashes + Math.floor(Math.random() * 1000000),
          sharesFound: prev.sharesFound + (Math.random() > 0.8 ? 1 : 0),
          uptime: prev.uptime + 1
        }));

        // Update ant activities
        setAnts(prev => prev.map(ant => ({
          ...ant,
          currentHash: generateRandomHash(),
          hashesComputed: ant.hashesComputed + Math.floor(Math.random() * 1000),
          status: Math.random() > 0.1 ? 'mining' : (Math.random() > 0.5 ? 'validating' : 'idle')
        })));

        // Simulate block progression
        setCurrentBlock(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 0.5, 100),
          difficulty: prev.difficulty + Math.random() * 0.01
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [ismining]);

  const generateRandomHash = () => {
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const handleStartMining = () => {
    setIsMining(true);
  };

  const handleStopMining = () => {
    setIsMining(false);
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
                disabled={ismining}
                className="bg-green-600 hover:bg-green-700"
              >
                <Zap className="mr-2 h-4 w-4" />
                Start Mining
              </Button>
              <Button 
                onClick={handleStopMining} 
                disabled={!ismining}
                variant="destructive"
              >
                Stop Mining
              </Button>
              <Badge variant={ismining ? "default" : "secondary"}>
                {ismining ? "Mining Active" : "Mining Stopped"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Current Block Progress */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Current Block: {currentBlock.height}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Block Progress</span>
                  <span>{currentBlock.progress.toFixed(2)}%</span>
                </div>
                <Progress value={currentBlock.progress} className="h-3" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Difficulty</p>
                  <p className="font-mono">{currentBlock.difficulty.toFixed(2)}T</p>
                </div>
                <div>
                  <p className="text-gray-500">Target Hash</p>
                  <p className="font-mono text-xs">{currentBlock.target}</p>
                </div>
                <div>
                  <p className="text-gray-500">Reward</p>
                  <p className="font-semibold">{currentBlock.reward} BTC</p>
                </div>
                <div>
                  <p className="text-gray-500">Time Left</p>
                  <p className="font-semibold">{currentBlock.estimatedTime}</p>
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
            <PoolConnection isConnected={ismining} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiningDashboard;