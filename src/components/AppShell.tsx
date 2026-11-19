'use client';

import React, { useState } from 'react';
import { PortalProvider } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <PortalProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Navbar onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </PortalProvider>
  );
};
