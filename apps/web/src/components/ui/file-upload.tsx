import {
  AlertCircleIcon,
  PaperclipIcon,
  UploadIcon,
  XIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBytes, useFileUpload } from '@/hooks/use-file-upload';

// biome-ignore lint/style/noMagicNumbers: Its a megabyte
const MAX_SIZE = 1024 * 1024; // 1MB

export default function FileUpload() {
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    maxSize: MAX_SIZE,
  });

  const file = files[0];

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <button
        className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-input border-dashed p-4 transition-colors hover:bg-accent/50 has-disabled:pointer-events-none has-[input:focus]:border-ring has-disabled:opacity-50 has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
        data-dragging={isDragging || undefined}
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        type="button"
      >
        <input
          {...getInputProps()}
          aria-label="Upload file"
          className="sr-only"
          disabled={Boolean(file)}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div
            aria-hidden="true"
            className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
          >
            <UploadIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 font-medium text-sm">Upload file</p>
          <p className="text-muted-foreground text-xs">
            Drag & drop or click to browse (max. {formatBytes(MAX_SIZE)})
          </p>
        </div>
      </button>

      {errors.length > 0 && (
        <div
          className="flex items-center gap-1 text-destructive text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* File list */}
      {file && (
        <div className="space-y-2">
          <div
            className="flex items-center justify-between gap-2 rounded-xl border px-4 py-2"
            key={file.id}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <PaperclipIcon
                aria-hidden="true"
                className="size-4 shrink-0 opacity-60"
              />
              <div className="min-w-0">
                <p className="truncate font-medium text-[13px]">
                  {file.file.name}
                </p>
              </div>
            </div>

            <Button
              aria-label="Remove file"
              className="-me-2 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
              onClick={() => removeFile(files[0]?.id)}
              size="icon"
              variant="ghost"
            >
              <XIcon aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <section
        aria-live="polite"
        className="mt-2 text-center text-muted-foreground text-xs"
      >
        Single file uploader w/ max size ∙{' '}
        <a
          className="underline hover:text-foreground"
          href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md"
        >
          API
        </a>
      </section>
    </div>
  );
}
