import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { DeviceStat, BrowserStat } from '@/lib/analyticsData';
import { Progress } from '@/components/ui/progress';

interface DeviceStatsCardProps {
  devices: DeviceStat[];
  browsers: BrowserStat[];
}

const DeviceStatsCard: React.FC<DeviceStatsCardProps> = ({ devices, browsers }) => {
  const deviceIcons: Record<string, React.ElementType> = {
    'Desktop': Monitor,
    'Mobile': Smartphone,
    'Tablet': Tablet
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Device & Browser</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Devices */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Devices</h4>
          <div className="space-y-3">
            {devices.map((device) => {
              const Icon = deviceIcons[device.device] || Monitor;
              return (
                <div key={device.device} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span>{device.device}</span>
                    </div>
                    <span className="font-medium">{device.percentage}%</span>
                  </div>
                  <Progress value={device.percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Browsers */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Browsers</h4>
          <div className="space-y-2">
            {browsers.slice(0, 4).map((browser, index) => {
              const colors = ['bg-primary', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4'];
              return (
                <div key={browser.browser} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${colors[index]}`} />
                    <span className="text-muted-foreground">{browser.browser}</span>
                  </div>
                  <span className="font-medium">{browser.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceStatsCard;
