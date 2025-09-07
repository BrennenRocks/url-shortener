import { CheckIcon } from 'lucide-react';
import { Card, CardContent, CardTitle } from '../ui/card';

export default function UrlSuccess() {
  return (
    <Card className="border-primary/50 bg-primary/30 text-center">
      <CardContent className="pt-6">
        <div className="mb-3">
          <div className="zoom-in mx-auto flex h-12 w-12 animate-in items-center justify-center rounded-full bg-primary/50 duration-300">
            <CheckIcon className="h-6 w-6 text-success-foreground" />
          </div>
        </div>
        <CardTitle className="mb-2 text-lg text-success-foreground">
          URLs Shortened Successfully!
        </CardTitle>
        <p className="text-sm text-success-foreground/90 leading-relaxed">
          Your HTML content has been processed and all URLs have been shortened.
        </p>
      </CardContent>
    </Card>
  );
}
