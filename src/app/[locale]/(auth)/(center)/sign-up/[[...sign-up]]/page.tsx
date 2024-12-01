import { getI18nPath } from '@/utils/Helpers';
import { SignUp } from '@clerk/nextjs';
import { getTranslations } from 'next-intl/server';

type ISignUpPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: ISignUpPageProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'SignUp',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function SignUpPage(props: ISignUpPageProps) {
  const { locale } = await props.params;

  return (
    <div className="w-full max-w-md">
      <SignUp 
        path={getI18nPath('/sign-up', locale)}
        appearance={{
          elements: {
            rootBox: "relative z-10",
            card: "bg-[#f5f2ed] shadow-xl",
            headerTitle: "text-gray-900",
            headerSubtitle: "text-gray-600",
            formButtonPrimary: "bg-pink-600 hover:bg-pink-700 transition-colors",
            socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50 transition-colors",
            socialButtonsBlockButtonText: "text-gray-600",
            formFieldInput: "border-gray-300 focus:border-pink-500 focus:ring-pink-500",
            footerActionText: "text-gray-600",
            footerActionLink: "text-pink-600 hover:text-pink-700 transition-colors",
            // Additional sign-up specific elements
            formFieldLabel: "text-gray-700",
            formFieldLabelRow: "mb-1",
            formFieldRow: "mb-4",
            identityPreviewText: "text-gray-600",
            identityPreviewEditButton: "text-pink-600 hover:text-pink-700",
            // Form validation states
            formFieldInputError: "border-red-300 focus:border-red-500 focus:ring-red-500",
            formFieldErrorText: "text-red-600 text-sm mt-1",
            // Success states
            formFieldSuccessText: "text-green-600 text-sm mt-1",
            formFieldInputSuccess: "border-green-300 focus:border-green-500 focus:ring-green-500"
          },
          layout: {
            socialButtonsPlacement: "top",
            socialButtonsVariant: "blockButton"
          }
        }}
      />
    </div>
  );
}