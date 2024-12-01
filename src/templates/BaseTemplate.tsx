// ./src/templates/BaseTemplate.tsx
import { Logo } from '@/components/Logo';
import { useTranslations } from 'next-intl';

export const BaseTemplate = (props: {
  leftNav: React.ReactNode;
  rightNav?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const t = useTranslations('BaseTemplate');

  return (
    <div className="w-full text-gray-700 antialiased">
      <div className="mx-auto">
        <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md transition-all duration-300">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex h-20 items-center justify-between">
              {/* Logo Section */}
              <div className="shrink-0">
                <Logo />
              </div>

              {/* Left Navigation */}
              <nav className="hidden flex-1 justify-center md:flex">
                <ul className="flex items-center space-x-8">{props.leftNav}</ul>
              </nav>

              {/* Right Navigation */}
              <nav className="flex items-center space-x-6">
                <ul className="flex items-center space-x-6">{props.rightNav}</ul>
              </nav>
            </div>
          </div>
        </header>

        <main className="pt-20">{props.children}</main>

        <footer className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="py-8 text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <span>©</span>
                <span>{new Date().getFullYear()}</span>
                <span>Prontomueble.</span>
                <span className="text-gray-300">|</span>
                <span>
                  {t.rich('made_with', {
                    author: () => (
                      <a
                        href="https://github.com/GiselCaicedo"
                        className="text-blue-600 transition-colors hover:text-blue-800 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Gisel Caicedo
                      </a>
                    ),
                  })}
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
