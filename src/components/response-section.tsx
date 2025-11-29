import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/contexts/api-context";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ResponseSection = () => {
  const { isLoading, apiResponse } = useApi();
  const isEmpty = !isLoading && Object.keys(apiResponse).length === 0;

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="text-base">API Response</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-10 w-10 mb-4 animate-spin" />
            <p className="text-sm">Loading...</p>
          </div>
        )}

        {isEmpty && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Heart className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-sm text-center">Select an endpoint and test to see results</p>
          </div>
        )}

        {!isLoading && apiResponse?.error && (
          <div className="rounded-lg overflow-hidden border border-red-400 bg-black/95">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#1e1e1e] border-b border-red-400">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              <span className="ml-3 text-xs text-muted-foreground">Terminal — Error</span>
            </div>
            <pre className="text-red-400 p-4 text-xs whitespace-pre-wrap overflow-x-auto">
              {`❌ ERROR: ${apiResponse.error}`}
            </pre>
          </div>
        )}

        {!isLoading && !apiResponse.error && !isEmpty && (
          <div className="rounded-lg overflow-hidden border bg-black/95 border-neutral-700">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#1e1e1e] border-b border-neutral-700">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              <span className="ml-3 text-xs text-muted-foreground">Terminal — Output</span>
            </div>

            <pre className={cn("p-4 text-xs text-green-400", "overflow-x-auto whitespace-pre-wrap leading-relaxed")}>
              {`$ curl -X POST 
                ${JSON.stringify(apiResponse, null, 2)}
                `}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponseSection;
