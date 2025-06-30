import * as React from 'react';
import { cn } from '../../lib/utils';

const Card = ({ className, ...props }) => (
  <div className={cn('rounded-xl border bg-white text-card-foreground shadow', className)} {...props} />
);

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export { Card, CardContent };
