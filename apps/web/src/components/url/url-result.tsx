import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResizableTextarea from '@/components/ui/resizeable-textarea';

const COPY_SUCCESS_TIMEOUT = 2000;

type UrlResultProps = {
  updatedHtml: string;
};

export default function UrlResult({ updatedHtml }: UrlResultProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(updatedHtml);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), COPY_SUCCESS_TIMEOUT);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Processed HTML</CardTitle>
          <Button
            className="h-8 px-3 text-xs"
            onClick={handleCopyToClipboard}
            size="sm"
            variant="outline"
          >
            {copySuccess ? (
              <>
                <CheckIcon className="mr-1 h-3 w-3" />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon className="mr-1 h-3 w-3" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResizableTextarea
          className="min-h-32 w-full resize-none border-0 bg-muted/50 p-3 font-mono text-xs shadow-none focus-visible:ring-0"
          readOnly
          value={updatedHtml}
        />
      </CardContent>
    </Card>
  );
}
