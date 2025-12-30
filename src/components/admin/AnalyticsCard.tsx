import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  iconColor?: string;
  subtitle?: string;
  isLive?: boolean;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon: Icon,
  iconColor = 'text-primary',
  subtitle,
  isLive = false
}) => {
  const getTrendIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp className="h-3 w-3" />;
    if (change < 0) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getTrendColor = (isPositiveGood: boolean = true) => {
    if (change === undefined) return '';
    if (change > 0) return isPositiveGood ? 'text-green-500' : 'text-red-500';
    if (change < 0) return isPositiveGood ? 'text-red-500' : 'text-green-500';
    return 'text-muted-foreground';
  };

  // For bounce rate, lower is better
  const isPositiveGood = !title.toLowerCase().includes('bounce');

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg bg-muted/50", iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{value}</div>
          {isLive && (
            <span className="flex items-center gap-1 text-xs text-green-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live
            </span>
          )}
        </div>
        
        {change !== undefined && (
          <div className={cn("flex items-center gap-1 mt-1 text-xs", getTrendColor(isPositiveGood))}>
            {getTrendIcon()}
            <span>{change > 0 ? '+' : ''}{change}%</span>
            <span className="text-muted-foreground">{changeLabel}</span>
          </div>
        )}
        
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
