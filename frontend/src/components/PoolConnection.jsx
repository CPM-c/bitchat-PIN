import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Server, Wifi, Globe } from 'lucide-react';

const PoolConnection = ({ poolStatus }) => {
  const {
    connected = false,
    name = "Braiins Pool", 
    url = "stratum.braiins.com:3333",
    ping = 0,
    difficulty = 0,
    blocks_found = 15247,
    hashrate = "45.2 EH/s",
    miners = 28534,
    luck = "102.3%",
    fee = "2.5%"
  } = poolStatus || {};

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
            <span className="font-semibold">{name}</span>
            <Badge 
              variant={connected ? "default" : "secondary"}
              className={connected ? "bg-green-600" : ""}
            >
              {connected ? "connected" : "disconnected"}
            </Badge>
          </div>
          
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Server</span>
              <span className="font-mono text-xs">{url}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Worker</span>
              <span className="font-mono text-sm">ant_colony_miner.001</span>
            </div>
            {connected && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ping</span>
                  <span className="font-semibold">{ping}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty</span>
                  <span className="font-semibold">{difficulty}</span>
                </div>
              </>
            )}
          </div>

          <div className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Pool Statistics</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-green-50 rounded">
                <p className="font-semibold text-green-700">{hashrate}</p>
                <p className="text-green-600">Hashrate</p>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <p className="font-semibold text-blue-700">{miners.toLocaleString()}</p>
                <p className="text-blue-600">Miners</p>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <p className="font-semibold text-purple-700">{luck}</p>
                <p className="text-purple-600">Luck</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>Status:</strong> {connected ? "Real Bitcoin mining in progress" : "Disconnected from pool"}</p>
              <p><strong>Pool Fee:</strong> {fee} | <strong>Payout:</strong> Daily</p>
              <p><strong>Algorithm:</strong> SHA-256 with PMLL optimization</p>
              {blocks_found && <p><strong>Blocks Found:</strong> {blocks_found.toLocaleString()}</p>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoolConnection;