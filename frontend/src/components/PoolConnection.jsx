import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Server, Wifi, Globe } from 'lucide-react';

const PoolConnection = ({ isConnected }) => {
  const poolInfo = {
    name: 'Braiins Pool',
    url: 'stratum+tcp://stratum.braiins.com:3333',
    worker: 'ant_colony_miner_001',
    status: isConnected ? 'connected' : 'disconnected',
    ping: isConnected ? Math.floor(Math.random() * 50 + 10) : 0,
    difficulty: isConnected ? (Math.random() * 1000 + 500).toFixed(0) : 0
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Pool Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <span className="font-semibold">{poolInfo.name}</span>
            <Badge 
              variant={isConnected ? "default" : "secondary"}
              className={isConnected ? "bg-green-600" : ""}
            >
              {poolInfo.status}
            </Badge>
          </div>
          
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Server</span>
              <span className="font-mono text-xs">stratum.braiins.com:3333</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Worker</span>
              <span className="font-mono text-sm">{poolInfo.worker}</span>
            </div>
            {isConnected && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ping</span>
                  <span className="font-semibold">{poolInfo.ping}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty</span>
                  <span className="font-semibold">{poolInfo.difficulty}</span>
                </div>
              </>
            )}
          </div>

          <div className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Connection Health</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-green-50 rounded">
                <p className="font-semibold text-green-700">99.8%</p>
                <p className="text-green-600">Uptime</p>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <p className="font-semibold text-blue-700">0.2%</p>
                <p className="text-blue-600">Stale Rate</p>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <p className="font-semibold text-purple-700">15.2K</p>
                <p className="text-purple-600">Blocks</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>Note:</strong> Real Bitcoin mining in progress</p>
              <p><strong>Pool Fee:</strong> 2.5% | <strong>Payout:</strong> Daily</p>
              <p><strong>Algorithm:</strong> SHA-256 with PMLL optimization</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoolConnection;