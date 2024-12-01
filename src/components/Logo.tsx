// src/components/Logo.tsx
export const Logo = () => {
  return (
    <div className="flex items-center space-x-3">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-pink-500"
      >
        {/* Main 'P' shape */}
        <path
          d="M8 8C8 8 19 8 22 8C25 8 27 10 27 13C27 16 25 18 22 18H8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Vertical line of 'P' */}
        <path
          d="M8 8V24"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Angled line for furniture design element */}
        <path
          d="M14 24L18 18"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-2xl font-normal text-gray-900">
        Prontomueble
      </span>
    </div>
  );
};