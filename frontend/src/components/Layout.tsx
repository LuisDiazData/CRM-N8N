import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-primary-600">CRM Insurance</h1>
              </div>
              <nav className="ml-10 flex space-x-4">
                <a href="/" className="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">
                  Dashboard
                </a>
                <a href="/procedures" className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                  Trámites
                </a>
                <a href="/analytics" className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                  Analytics
                </a>
                <a href="/analysts" className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                  Analistas
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                Nuevo Trámite
              </button>
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

interface SidebarProps {
  items: Array<{
    name: string;
    href: string;
    icon?: React.ReactNode;
    active?: boolean;
  }>;
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      <nav className="flex flex-col gap-1 p-4">
        {items.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
              item.active
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.icon}
            {item.name}
          </a>
        ))}
      </nav>
    </aside>
  );
}
