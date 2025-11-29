import HealthApi from "@/components/api/health-api";
import ModelInfoApi from "@/components/api/model-info-api";
import PredictRawApi from "@/components/api/predict-raw-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code } from "lucide-react";
import { useState } from "react";

const ApiSection = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState("predict-raw");

  return (
    <div className="lg:col-span-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            API Endpoint Testing
          </CardTitle>
          <CardDescription>Test different API endpoints with your selected server</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
            <TabsList className="grid grid-cols-3 lg:grid-cols-7 gap-1 h-auto p-2 bg-accent/30">
              <TabsTrigger value="health" className="text-xs">
                Health
              </TabsTrigger>
              <TabsTrigger value="model-info" className="text-xs">
                Model Info
              </TabsTrigger>
              <TabsTrigger value="predict-raw" className="text-xs">
                Predict Raw
              </TabsTrigger>
              <TabsTrigger value="predict" className="text-xs">
                Predict
              </TabsTrigger>
              <TabsTrigger value="batch" className="text-xs">
                Batch
              </TabsTrigger>
              <TabsTrigger value="sample" className="text-xs">
                Sample
              </TabsTrigger>
              <TabsTrigger value="sample-raw" className="text-xs">
                Sample Raw
              </TabsTrigger>
            </TabsList>
            <HealthApi />
            <ModelInfoApi />
            <PredictRawApi />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiSection;
