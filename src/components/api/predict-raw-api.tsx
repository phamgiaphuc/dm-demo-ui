import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { useApi } from "@/contexts/api-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, Loader2, TrendingUp } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

const predictSchema = z.object({
  age: z.number().min(18).max(100),
  gender: z.enum(["Male", "Female"]),
  bloodPressure: z.number().min(90).max(200),
  bmi: z.number().min(15).max(50),
  sleepHours: z.number().min(3).max(12),
  cholesterolLevel: z.number().min(100).max(400),
  triglyceride_level: z.number().min(50).max(500),
  fastingBloodSugar: z.number().min(70).max(200),
  crpLevel: z.number().min(0).max(20),
  homocysteineLevel: z.number().min(5).max(25),

  exerciseHabits: z.enum(["Low", "Moderate", "High"]),
  alcoholConsumption: z.enum(["None", "Light", "Moderate", "Heavy"]),
  stressLevel: z.enum(["Low", "Moderate", "High"]),
  sugarConsumption: z.enum(["Low", "Moderate", "High", "Very High"]),

  smoking: z.enum(["Yes", "No"]),
  diabetes: z.enum(["Yes", "No"]),
  familyHeartDisease: z.enum(["Yes", "No"]),
  highBloodPressure: z.enum(["Yes", "No"]),
  lowHdlCholesterol: z.enum(["Yes", "No"]),
  highLdlCholesterol: z.enum(["Yes", "No"]),
});

type PredictFormValues = z.infer<typeof predictSchema>;

const PredictRawApi = () => {
  const { testEndpoint, isLoading } = useApi();

  const form = useForm<PredictFormValues>({
    resolver: zodResolver(predictSchema),
    defaultValues: {
      age: 25,
      gender: "Male",
      bloodPressure: 120,
      bmi: 22,
      sleepHours: 7,
      cholesterolLevel: 180,
      triglyceride_level: 120,
      fastingBloodSugar: 90,
      crpLevel: 1,
      homocysteineLevel: 10,

      exerciseHabits: "Moderate",
      alcoholConsumption: "Light",
      stressLevel: "Moderate",
      sugarConsumption: "Moderate",

      smoking: "No",
      diabetes: "No",
      familyHeartDisease: "No",
      highBloodPressure: "No",
      lowHdlCholesterol: "No",
      highLdlCholesterol: "No",
    },
  });

  const onSubmit = async (values: PredictFormValues) => {
    await testEndpoint("/predict/raw", "POST", values);
  };

  return (
    <TabsContent value="predict-raw" className="space-y-4 mt-6">
      <Alert>
        <TrendingUp className="h-4 w-4" />
        <AlertDescription>
          <strong>POST /predict/raw</strong> - Predict with raw values (recommended)
        </AlertDescription>
      </Alert>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Section title="Demographics">
            <Grid cols={2}>
              <NumberField name="age" label="Age (years)" min={18} max={100} />
              <SelectField name="gender" label="Gender" options={["Male", "Female"]} />
            </Grid>
          </Section>

          <Section title="Vital Signs">
            <Grid cols={3}>
              <NumberField name="bloodPressure" label="Blood Pressure (mmHg)" min={90} max={200} />
              <NumberField name="bmi" label="BMI" min={15} max={50} step={0.1} />
              <NumberField name="sleepHours" label="Sleep Hours" min={3} max={12} step={0.5} />
            </Grid>
          </Section>

          <Section title="Lab Results">
            <Grid cols={2}>
              <NumberField name="cholesterolLevel" label="Cholesterol (mg/dL)" min={100} max={400} />
              <NumberField name="triglyceride_level" label="Triglyceride (mg/dL)" min={50} max={500} />
              <NumberField name="fastingBloodSugar" label="Fasting Blood Sugar (mg/dL)" min={70} max={200} />
              <NumberField name="crpLevel" label="CRP Level (mg/L)" min={0} max={20} step={0.1} />
              <NumberField name="homocysteineLevel" label="Homocysteine (µmol/L)" min={5} max={25} step={0.1} />
            </Grid>
          </Section>

          <Section title="Lifestyle">
            <Grid cols={2}>
              <SelectField name="exerciseHabits" label="Exercise" options={["Low", "Moderate", "High"]} />
              <SelectField name="alcoholConsumption" label="Alcohol" options={["None", "Light", "Moderate", "Heavy"]} />
              <SelectField name="stressLevel" label="Stress" options={["Low", "Moderate", "High"]} />
              <SelectField name="sugarConsumption" label="Sugar" options={["Low", "Moderate", "High", "Very High"]} />
            </Grid>
          </Section>

          <Section title="Medical Conditions">
            <Grid cols={2}>
              {[
                "smoking",
                "diabetes",
                "familyHeartDisease",
                "highBloodPressure",
                "lowHdlCholesterol",
                "highLdlCholesterol",
              ].map((field) => (
                <SelectField
                  key={field}
                  name={field as keyof PredictFormValues}
                  label={labelize(field)}
                  options={["Yes", "No"]}
                />
              ))}
            </Grid>
          </Section>

          <Button type="submit" className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Activity className="mr-2 h-4 w-4" />}
            Run Prediction
          </Button>
        </form>
      </Form>
    </TabsContent>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Grid({ cols = 2, children }: { cols?: number; children: React.ReactNode }) {
  return <div className={`grid md:grid-cols-${cols} gap-3`}>{children}</div>;
}

function NumberField({
  name,
  label,
  min,
  max,
  step,
}: {
  name: keyof PredictFormValues;
  label: string;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-xs">{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              min={min}
              max={max}
              step={step}
              {...field}
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function SelectField({ name, label, options }: { name: keyof PredictFormValues; label: string; options: string[] }) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-xs">{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="mb-0">
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-background z-50">
              {options.map((opt: string) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function labelize(str: string) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

export default PredictRawApi;
