/** biome-ignore-all lint/style/noNestedTernary: complex conditional UI state requires nested ternary */

import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRightIcon, CheckIcon, CodeIcon } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import ResizableTextarea from '@/components/ui/resizeable-textarea';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [updatedHtml, setUpdatedHtml] = useState('');

  const { mutateAsync: shortenUrls } = useMutation({
    mutationFn: async (urls: string[]) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/url/shorten`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ urls }),
        }
      );
      return response.json();
    },
  });

  const form = useForm({
    defaultValues: {
      html: '',
    },
    onSubmit: async () => {
      const htmlContent = form.state.values.html;

      // Extract URLs from HTML content using regex
      const urlRegex = /https?:\/\/[^\s<>"']+/gi;
      const urls = htmlContent.match(urlRegex) || [];

      if (urls.length === 0) {
        return;
      }
      const { urls: shortenedUrls } = await shortenUrls(urls);
      setUpdatedHtml(shortenedUrls);
    },
    validators: {
      onSubmit: z.object({
        html: z.string().min(1, 'Please enter your HTML content'),
      }),
    },
  });

  return (
    <div className="relative h-svh w-full">
      {/* Form content - flows naturally on mobile, under top content on desktop */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-start px-4 pt-64 text-center md:justify-start md:pt-80 ${updatedHtml ? 'mt-2' : 'mt-20'}`}
      >
        <div className="w-full max-w-md px-4 sm:px-0">
          {updatedHtml ? (
            <div className="fade-in-0 slide-in-from-bottom-4 animate-in rounded-lg border border-success/50 bg-success/40 p-3 text-center duration-500 sm:p-6">
              <div className="mb-3">
                <div className="zoom-in mx-auto flex h-12 w-12 animate-in items-center justify-center rounded-full bg-success/50 duration-300">
                  <CheckIcon className="h-6 w-6 text-success-foreground" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-lg text-success-foreground">
                URLs Shortened Successfully!
              </h3>
              <p className="mb-4 text-sm text-success-foreground/90 leading-relaxed">
                Your HTML content has been processed and all URLs have been
                shortened.
              </p>
              <p className="text-success-foreground/90 text-xs">
                The updated HTML with shortened URLs is ready for use.
              </p>
            </div>
          ) : (
            <form.Subscribe>
              {(state) => (
                <div
                  className={`transition-all duration-500 ease-out ${state.isSubmitting ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}
                >
                  <form
                    className="space-y-4"
                    noValidate
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.handleSubmit();
                    }}
                  >
                    <div className="group relative">
                      <p className="mb-2 text-foreground/90 text-sm leading-relaxed">
                        Paste your HTML content to shorten all URLs
                      </p>

                      <form.Field name="html">
                        {(field) => (
                          <div className="space-y-2">
                            <div className="relative flex items-center overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-300 group-focus-within:shadow-md group-focus-within:ring-2 group-focus-within:ring-ring/20 group-hover:shadow-md">
                              <div className="flex items-center pl-3 text-muted-foreground">
                                <CodeIcon className="h-4 w-4" />
                              </div>

                              <ResizableTextarea
                                className="flex-1 border-0 bg-card px-3 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-card"
                                disabled={state.isSubmitting}
                                hasError={
                                  field.state.meta.isTouched &&
                                  field.state.meta.errors.length > 0
                                }
                                id={field.name}
                                name={field.name}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                placeholder="Paste your HTML content here..."
                                value={field.state.value}
                              />

                              <Button
                                className="group/button m-1 px-4 transition-all duration-300 active:scale-95"
                                disabled={
                                  !state.canSubmit ||
                                  state.isSubmitting ||
                                  !field.state.value
                                }
                                size="sm"
                                type="submit"
                              >
                                <span className="ml-2 hidden sm:inline">
                                  {state.isSubmitting
                                    ? 'Processing...'
                                    : 'Shorten'}
                                </span>
                                {state.isSubmitting ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : (
                                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/button:translate-x-0.5" />
                                )}
                              </Button>
                            </div>
                            {field.state.meta.errors.map((error) => (
                              <p
                                className="text-destructive text-sm dark:text-red-400 dark:drop-shadow-sm"
                                key={error?.message}
                              >
                                {error?.message}
                              </p>
                            ))}
                          </div>
                        )}
                      </form.Field>
                    </div>
                  </form>
                </div>
              )}
            </form.Subscribe>
          )}
        </div>
      </div>
    </div>
  );
}
