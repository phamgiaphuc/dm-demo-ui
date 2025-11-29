import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useApi } from "@/contexts/api-context";
import { Activity, Loader2 } from "lucide-react";

const HealthApi = () => {
  const { testEndpoint, isLoading } = useApi();

  return (
    <TabsContent value="health" className="space-y-4 mt-6">
      <Alert>
        <Activity className="size-4" />
        <AlertDescription>
          <strong>GET /health</strong> - Check API server status and model availability
        </AlertDescription>
      </Alert>
      <Button onClick={() => testEndpoint("/health")} disabled={isLoading} className="w-full">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Test Health Endpoint
      </Button>
    </TabsContent>
  );
};

export default HealthApi;
