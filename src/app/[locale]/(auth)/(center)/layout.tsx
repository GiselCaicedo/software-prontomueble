import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function CenteredLayout(props: { children: React.ReactNode }) {
  // Check authentication status and redirect if user is already logged in
  const { userId } = await auth();
  if (userId) {
    redirect('/dashboard');
  }

  return (
    // The outer container maintains full viewport coverage
    <div className="relative min-h-screen min-w-screen overflow-hidden">
      {/* Background image container */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/images/auth/pacific-office-interiors-GDz5SJ3fuAQ-unsplash.jpg')"
        }}
      >
        {/* Decorative bars container */}
        <div className="absolute inset-0">
          {/* Top decorative bar - This creates the upper diagonal gradient */}
          <div 
            className="absolute w-[200%] h-[800px] bg-gradient-to-r from-amber-700/90 to-amber-900/90 origin-top-left -translate-y-1/2"
            style={{
              transform: 'rotate(-15deg) translateX(-50%) translateY(-50%)',
            }}
          />
          
          {/* Bottom decorative bar - This creates the lower diagonal gradient */}
          <div 
            className="absolute bottom-0 w-[200%] h-[800px] bg-gradient-to-r from-amber-900/90 to-amber-700/90 origin-bottom-right translate-y-1/2"
            style={{
              transform: 'rotate(15deg) translateX(0%) translateY(50%)',
            }}
          />
        </div>

        {/* Subtle overlay for better content visibility */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
      </div>

      {/* Content container - Centers the auth forms */}
      <div className="relative flex min-h-screen min-w-screen items-center justify-center">
        {props.children}
      </div>
    </div>
  );
}