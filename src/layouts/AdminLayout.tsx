import { Outlet } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar role="admin" />
        <main className="flex-1 overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
