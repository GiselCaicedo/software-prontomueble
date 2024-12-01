import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { BaseTemplate } from '@/templates/BaseTemplate';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);


  return (
    <>
      <BaseTemplate
        leftNav={(
          <>
            <li>
              
            </li>
          </>
        )}
        rightNav={(
          <>
            <li>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-pink-600 bg-pink-50 rounded-full hover:bg-pink-100"
              >
                Quiere vender
              </Link>
            </li>
            <li>
              <Link
                href="/sign-in"
                className="border-none text-gray-700 hover:text-gray-900"
              >
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link
                href="/sign-up"
                className="border-none text-gray-700 hover:text-gray-900"
              >
                Registrarse
              </Link>
            </li>
            <li>
              <button className="text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
            </li>
            <li>
              <LocaleSwitcher />
            </li>
          </>
        )}
      >
        <div className="relative">
          {props.children}
        </div>
      </BaseTemplate>
    </>
  );
}