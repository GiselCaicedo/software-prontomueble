import React from 'react';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { BaseTemplate } from '@/templates/BaseTemplate';
import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <BaseTemplate
      leftNav={(
        <nav className="flex space-x-6">
          <Link
            href={{ pathname: '/dashboard' }}
            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Vender
          </Link>
          <Link
            href={{ pathname: '/dashboard/inventario' }}
            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Inventario
          </Link>
          <Link
            href={{ pathname: '/dashboard/proveedores' }}
            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Proveedores
          </Link>
          <Link
            href={{ pathname: '/dashboard/clientes' }}
            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Clientes
          </Link>
          <Link
            href={{ pathname: '/dashboard/ventas' }}
            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Ventas
          </Link>
          <Link
            href={{ pathname: '/dashboard/reportes' }}
            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Reportes
          </Link>
        </nav>
      )}
      rightNav={(
        <div className="flex items-center space-x-4">
          <SignOutButton>
            <button 
              type="button"
              className="text-gray-700 hover:text-gray-900 p-2 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </SignOutButton>
          <LocaleSwitcher />
        </div>
      )}
    >
      {children}
    </BaseTemplate>
  );
};

export default DashboardLayout;

export const dynamic = 'force-dynamic';