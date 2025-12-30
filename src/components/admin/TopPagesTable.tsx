import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TopPage, formatDuration } from '@/lib/analyticsData';

interface TopPagesTableProps {
  pages: TopPage[];
}

const TopPagesTable: React.FC<TopPagesTableProps> = ({ pages }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Visitors</TableHead>
                <TableHead className="text-right">Avg. Time</TableHead>
                <TableHead className="text-right">Bounce Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.slice(0, 6).map((page, index) => (
                <TableRow key={page.path}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{page.title}</p>
                        <p className="text-xs text-muted-foreground">{page.path}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {page.views.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {page.uniqueVisitors.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDuration(page.avgTimeOnPage)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={page.bounceRate > 50 ? 'text-red-500' : 'text-green-500'}>
                      {page.bounceRate}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopPagesTable;
