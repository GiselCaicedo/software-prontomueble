"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';

type NavLinkProps = {
  href: Route;
  children: React.ReactNode;
  className?: string;
};

export function NavLink({ href, children, className = '' }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative py-2 text-base transition-colors duration-200 ${
        isActive 
          ? 'text-gray-900 font-medium'
          : 'text-gray-600 hover:text-gray-900'
      } ${className}
      after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:scale-x-0 after:bg-pink-500 
      after:transition-transform after:duration-300 hover:after:scale-x-100 ${
        isActive ? 'after:scale-x-100' : ''
      }`}
    >
      {children}
    </Link>
  );
}