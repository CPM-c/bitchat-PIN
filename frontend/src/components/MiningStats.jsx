import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, Hash, Award, Clock } from 'lucide-react';

const MiningStats = ({ stats }) => {
  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatHashRate = (hashRate) => {
    if (hashRate > 1000000) {
      return `${(hashRate / 1000000).toFixed(2)} MH/s`;
    } else if (hashRate > 1000) {
      return `${(hashRate / 1000).toFixed(2)} KH/s`;
    }
    return `${hashRate.toFixed(2)} H/s`;
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Mining Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Hash className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-700">
                {formatHashRate(stats.hashRate)}
              </p>
              <p className="text-sm text-green-600">Hash Rate</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Award className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-700">
                {stats.sharesFound}
              </p>
              <p className="text-sm text-blue-600">Shares Found</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Session Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Hashes</span>
              <span className="font-mono font-semibold">
                {stats.totalHashes.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Uptime</span>
              <span className="font-semibold">
                {formatUptime(stats.uptime)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Accepted Shares</span>
              <span className="font-semibold text-green-600">
                {stats.acceptedShares}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rejected Shares</span>
              <span className="font-semibold text-red-600">
                {stats.rejectedShares}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Efficiency</span>
              <span className="font-semibold">
                {stats.acceptedShares > 0 
                  ? ((stats.acceptedShares / (stats.acceptedShares + stats.rejectedShares)) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>PMLL Algorithm Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Algorithm</span>
              <span className="font-mono text-sm">PMLL-SHA256</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Optimization</span>
              <span className="text-green-600 font-semibold">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Memory Usage</span>
              <span className="font-mono text-sm">
                {(Math.random() * 512 + 256).toFixed(0)} MB
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MiningStats;