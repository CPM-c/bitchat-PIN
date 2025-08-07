import React, { useEffect, useRef } from 'react';
import { Badge } from './ui/badge';

const AntMinerAnimation = ({ ants, ismining }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw mining field background
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, width, height);
      
      // Draw grid pattern
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw ants
      ants.forEach((ant, index) => {
        const x = (ant.position.x * width) / 100;
        const y = (ant.position.y * height) / 100;
        
        // Ant body
        ctx.fillStyle = getAntColor(ant.status);
        ctx.beginPath();
        ctx.ellipse(x, y, 8, 5, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Ant head
        ctx.fillStyle = '#4b5563';
        ctx.beginPath();
        ctx.arc(x - 6, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Mining activity indicator
        if (ismining && ant.status === 'mining') {
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 15, 0, 2 * Math.PI);
          ctx.stroke();
          
          // Hash visualization
          ctx.fillStyle = '#10b981';
          ctx.font = '8px monospace';
          ctx.fillText(ant.currentHash.slice(0, 8), x + 20, y + 3);
        }
        
        // Ant ID
        ctx.fillStyle = '#374151';
        ctx.font = '10px sans-serif';
        ctx.fillText(`#${ant.id}`, x - 10, y + 25);
      });
      
      if (isming) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const getAntColor = (status) => {
      switch (status) {
        case 'mining': return '#10b981'; // green
        case 'validating': return '#f59e0b'; // amber
        case 'idle': return '#6b7280'; // gray
        default: return '#6b7280';
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [ants, isming]);

  const getStatusCount = (status) => {
    return ants.filter(ant => ant.status === status).length;
  };

  return (
    <div className="space-y-4">
      <canvas 
        ref={canvasRef}
        className="w-full h-80 border rounded-lg bg-gray-50"
        style={{ width: '100%', height: '320px' }}
      />
      
      {/* Ant Status Summary */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="default" className="bg-green-600">
          Mining: {getStatusCount('mining')}
        </Badge>
        <Badge variant="default" className="bg-amber-600">
          Validating: {getStatusCount('validating')}
        </Badge>
        <Badge variant="secondary">
          Idle: {getStatusCount('idle')}
        </Badge>
      </div>

      {/* Individual Ant Stats */}
      <div className="max-h-40 overflow-y-auto space-y-2">
        {ants.map(ant => (
          <div key={ant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: ant.status === 'mining' ? '#10b981' : ant.status === 'validating' ? '#f59e0b' : '#6b7280' }}
              />
              <span className="font-mono text-sm">Ant #{ant.id}</span>
              <Badge variant="outline" className="text-xs">
                {ant.status}
              </Badge>
            </div>
            <div className="text-xs text-gray-500">
              {ant.hashesComputed.toLocaleString()} H/s
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AntMinerAnimation;