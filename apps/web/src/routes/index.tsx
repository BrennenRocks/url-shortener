/** biome-ignore-all lint/style/noNestedTernary: complex conditional UI state requires nested ternary */

import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRightIcon, UploadIcon } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import ResizableTextarea from '@/components/ui/resizeable-textarea';
import UrlResult from '@/components/url/url-result';
import UrlSuccess from '@/components/url/url-success';
import { useFileUpload } from '@/hooks/use-file-upload';
import { parseUrlsFromHtml } from '@/lib/utils';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

const BYTES_PER_KB = 1024;
const KB_PER_MB = 1024;
const MAX_FILE_SIZE_MB = 1;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * KB_PER_MB * BYTES_PER_KB; // 1MB

function RouteComponent() {
  const [updatedHtml, setUpdatedHtml] = useState('');

  const handleStartOver = () => {
    setUpdatedHtml('');
    form.reset();
  };

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
      const urls = parseUrlsFromHtml(htmlContent);

      if (urls.length === 0) {
        form.setErrorMap({
          onSubmit: {
            fields: { html: { message: 'No URLs found in the HTML content' } },
          },
        });
        return;
      }

      const { urls: shortenedUrls } = await shortenUrls(urls);

      // Replace original URLs with shortened URLs in the HTML content
      let processedHtml = htmlContent;
      for (let i = 0; i < urls.length; i++) {
        const originalUrl = urls[i];
        const shortenedUrlObj = shortenedUrls[i];
        if (shortenedUrlObj?.shortUrl) {
          processedHtml = processedHtml.replaceAll(
            originalUrl,
            shortenedUrlObj.shortUrl
          );
        }
      }

      setUpdatedHtml(processedHtml);
    },
    validators: {
      onSubmit: z.object({
        html: z.string().min(1, 'Please enter your HTML content'),
      }),
    },
  });

  const [fileState, fileActions] = useFileUpload({
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    accept: '.html,.htm,.txt',
    multiple: false,
    onFilesAdded: async (files) => {
      if (files.length > 0) {
        const file = files[0].file;
        if (file instanceof File) {
          try {
            const content = await file.text();
            form.setFieldValue('html', content);
          } catch {
            // Handle file reading error silently for better UX
            fileActions.clearErrors();
          }
        }
      }
    },
  });

  return (
    <div className="relative h-svh w-full">
      <div
        className={`absolute inset-0 flex flex-col items-center justify-start px-4 text-center md:justify-start ${updatedHtml ? 'mt-2' : 'mt-20'}`}
      >
        <div className="w-full max-w-md px-4 sm:px-0">
          {updatedHtml ? (
            <div className="fade-in-0 slide-in-from-bottom-4 animate-in space-y-4 duration-500">
              <UrlSuccess />
              <UrlResult updatedHtml={updatedHtml} />

              <div className="flex justify-center">
                <Button
                  className="px-6"
                  onClick={handleStartOver}
                  variant="outline"
                >
                  Process Another File
                </Button>
              </div>
            </div>
          ) : (
            <form.Subscribe>
              {(state) => (
                <div
                  className={`transition-all duration-500 ease-out ${state.isSubmitting ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}
                >
                  <form className="space-y-4" noValidate>
                    <div className="relative">
                      <p className="mb-2 text-foreground/90 text-sm leading-relaxed">
                        Paste your HTML content to shorten all URLs
                      </p>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <form.Field name="html">
                            {(field) => (
                              <div className="space-y-2">
                                {/** biome-ignore lint/a11y/useFocusableInteractive: Must be a div because we are nesting a button */}
                                {/** biome-ignore lint/a11y/useSemanticElements: Must be a div because we are nesting a button */}
                                <div
                                  className={`relative w-full rounded-lg border bg-card p-4 text-left shadow-sm transition-all duration-300 focus-within:shadow-md focus-within:ring-2 focus-within:ring-ring/20 ${
                                    fileState.isDragging
                                      ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20'
                                      : 'hover:shadow-md'
                                  }`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    fileActions.openFileDialog();
                                  }}
                                  onDragEnter={fileActions.handleDragEnter}
                                  onDragLeave={fileActions.handleDragLeave}
                                  onDragOver={fileActions.handleDragOver}
                                  onDrop={fileActions.handleDrop}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      fileActions.openFileDialog();
                                    }
                                  }}
                                  role="button"
                                >
                                  {/* Drag overlay */}
                                  {fileState.isDragging && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-primary/10 backdrop-blur-sm">
                                      <div className="flex flex-col items-center space-y-2 text-primary">
                                        <UploadIcon className="h-8 w-8" />
                                        <p className="font-medium text-sm">
                                          Drop your HTML file here
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Hidden file input */}
                                  <input
                                    {...fileActions.getInputProps()}
                                    className="hidden"
                                  />

                                  <div className="space-y-3">
                                    <div className="relative flex items-center">
                                      <ResizableTextarea
                                        className="flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                                        onKeyDown={(e) => {
                                          // Handle Ctrl+Enter or Cmd+Enter to submit form
                                          if (
                                            (e.ctrlKey || e.metaKey) &&
                                            e.key === 'Enter' &&
                                            state.canSubmit &&
                                            !state.isSubmitting &&
                                            field.state.value
                                          ) {
                                            e.stopPropagation();
                                            form.handleSubmit();
                                            return;
                                          }

                                          // Prevent parent div from handling keys that should work normally in textarea
                                          // This ensures proper text input and navigation functionality
                                          if (
                                            e.key === 'Enter' ||
                                            e.key === ' '
                                          ) {
                                            e.stopPropagation();
                                          }
                                        }}
                                        placeholder="Paste HTML or drop a file..."
                                        value={field.state.value}
                                      />
                                    </div>

                                    <div className="flex justify-end">
                                      <Button
                                        className="group rounded-full px-6 py-2 font-medium text-sm transition-all duration-300 hover:shadow-md active:scale-95"
                                        disabled={
                                          !state.canSubmit ||
                                          state.isSubmitting ||
                                          !field.state.value
                                        }
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          form.handleSubmit();
                                        }}
                                        onKeyDown={(e) => {
                                          if (
                                            ((e.ctrlKey || e.metaKey) &&
                                              e.key === 'Enter') ||
                                            e.key === ' '
                                          ) {
                                            e.stopPropagation();
                                            form.handleSubmit();
                                          }
                                        }}
                                        size="sm"
                                        type="button"
                                      >
                                        {state.isSubmitting ? (
                                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        ) : (
                                          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                <p className="text-foreground/70 text-xs">
                                  Accepts{' '}
                                  <span className="font-semibold">
                                    .html, .htm,
                                  </span>{' '}
                                  and{' '}
                                  <span className="font-semibold">.txt</span>{' '}
                                  files. {MAX_FILE_SIZE_MB}MB max.
                                </p>

                                {field.state.meta.errors.map((error) => (
                                  <p
                                    className="text-destructive text-sm dark:text-red-400 dark:drop-shadow-sm"
                                    key={error?.message}
                                  >
                                    {error?.message}
                                  </p>
                                ))}

                                {/* File upload errors */}
                                {fileState.errors.map((error) => (
                                  <p
                                    className="text-destructive text-sm dark:text-red-400 dark:drop-shadow-sm"
                                    key={error}
                                  >
                                    {error}
                                  </p>
                                ))}
                              </div>
                            )}
                          </form.Field>
                        </div>
                      </div>
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
