import ApiSection from "@/components/api-section";
import ResponseSection from "@/components/response-section";
import ServerSection from "@/components/server-section";

const Index = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <ServerSection />
      <ApiSection />
      <ResponseSection />
    </div>
  );
};

export default Index;
