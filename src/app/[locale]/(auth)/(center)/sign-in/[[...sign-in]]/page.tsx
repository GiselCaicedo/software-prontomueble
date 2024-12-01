import { getI18nPath } from '@/utils/Helpers';
import { SignIn } from '@clerk/nextjs';
import { getTranslations } from 'next-intl/server';

type ISignInPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: ISignInPageProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'SignIn',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function SignInPage(props: ISignInPageProps) {
  const { locale } = await props.params;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/images/auth/pacific-office-interiors-GDz5SJ3fuAQ-unsplash.jpg')"
        }}
      >
        {/* Decorative Bars */}
        <div className="absolute inset-0">
          {/* Top bar - rotated and positioned */}
          <div 
            className="absolute w-[200%] h-[800px] bg-gradient-to-r from-amber-700/90 to-amber-900/90 origin-top-left -translate-y-1/2"
            style={{
              transform: 'rotate(-15deg) translateX(-50%) translateY(-50%)',
            }}
          />
          {/* Bottom bar - rotated and positioned differently */}
          <div 
            className="absolute bottom-0 w-[200%] h-[800px] bg-gradient-to-r from-amber-900/90 to-amber-700/90 origin-bottom-right translate-y-1/2"
            style={{
              transform: 'rotate(15deg) translateX(0%) translateY(50%)',
            }}
          />
        </div>

        {/* Subtle overlay for better readability */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
      </div>

      {/* Sign In Form Container */}
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <SignIn 
            path={getI18nPath('/sign-in', locale)}
            appearance={{
              elements: {
                rootBox: "relative z-10",
                card: "bg-[#f5f2ed] shadow-xl",
                headerTitle: "text-gray-900",
                headerSubtitle: "text-gray-600",
                formButtonPrimary: "bg-pink-600 hover:bg-pink-700",
                socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50",
                socialButtonsBlockButtonText: "text-gray-600",
                formFieldInput: "border-gray-300 focus:border-pink-500 focus:ring-pink-500",
                footerActionText: "text-gray-600",
                footerActionLink: "text-pink-600 hover:text-pink-700"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}