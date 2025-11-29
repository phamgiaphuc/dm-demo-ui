import { TabsContent } from "@/components/ui/tabs";
import { FileText, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useApi } from "@/contexts/api-context";

const ModelInfoApi = () => {
  const { testEndpoint, isLoading } = useApi();

  return (
    <TabsContent value="model-info" className="space-y-4 mt-6">
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          <strong>GET /model/info</strong> - Get detailed information about the ML model
        </AlertDescription>
      </Alert>
      <Button onClick={() => testEndpoint("/model/info")} disabled={isLoading} className="w-full">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Get Model Info
      </Button>
    </TabsContent>
  );
};

export default ModelInfoApi;
