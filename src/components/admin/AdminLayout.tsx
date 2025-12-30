import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { cn } from '@/lib/utils';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      {/* Main content */}
      <main className={cn(
        "transition-all duration-300 ease-in-out",
        "lg:ml-64 min-h-screen"
      )}>
        <div className="p-6 pt-16 lg:pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
