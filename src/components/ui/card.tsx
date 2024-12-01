// components/ui/card.tsx
import { cn } from '@/libs/utils';
import * as React from 'react';

// Define the base Card component and its variants
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm',
      className,
    )}
    {...props}
  />
));
Card.displayName = 'Card';

// Card Header component for consistent header styling
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

// Card Title component for standardized titles
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  >
    {/* Ensure there is content inside the heading for screen readers */}
    {props.children || 'Default Card Title'}
  </h3>
));
CardTitle.displayName = 'CardTitle';

// Card Content component for consistent padding and spacing
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export { Card, CardContent, CardHeader, CardTitle };
