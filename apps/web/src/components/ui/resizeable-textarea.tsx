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
        // Custom scrollbar styling
        'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30',
        // Webkit scrollbar fallback
        '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2',
        hasError && 'border-destructive ring-destructive/20',
        className
      )}
      {...props}
    />
  );
}
