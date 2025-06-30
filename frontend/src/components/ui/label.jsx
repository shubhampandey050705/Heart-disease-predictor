import * as React from 'react';
import { cn } from '../../lib/utils';

const Label = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      className={cn('text-sm font-medium leading-none text-gray-700', className)}
      ref={ref}
      {...props}
    />
  );
});
Label.displayName = 'Label';

export { Label };
