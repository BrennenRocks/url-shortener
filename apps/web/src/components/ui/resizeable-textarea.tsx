import type * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type ResizableTextareaProps = React.ComponentProps<'textarea'> & {
  hasError?: boolean;
};

export default function ResizableTextarea({
  className,
  hasError,
  ...props
}: ResizableTextareaProps) {
  return (
    <Textarea
      className={cn(
        'field-sizing-content max-h-96 min-h-0 resize-none py-1.75',
        hasError && 'border-destructive ring-destructive/20',
        className
      )}
      {...props}
    />
  );
}
