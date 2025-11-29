import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader, Plus, RefreshCw, Server, Trash2, Edit2 } from "lucide-react";
import { useServer } from "@/contexts/server-context";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const initialValues = {
  name: "",
  url: "",
  basePath: "/api/v1",
};

const serverSchema = z.object({
  name: z.string().min(1, "Server name is required"),
  url: z.url("Must be a valid URL"),
  basePath: z.string().min(1, "Base path is required"),
});

type ServerFormValues = z.infer<typeof serverSchema>;

const ServerSection = () => {
  const { servers, selectedServerId, setSelectedServerId, addServer, editServer, removeServer, checkServerHealth } =
    useServer();

  const [showForm, setShowForm] = useState(false);
  const [editServerId, setEditServerId] = useState<string | null>(null);

  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverSchema),
    defaultValues: initialValues,
  });

  const onSubmit = (data: ServerFormValues) => {
    if (editServerId) {
      editServer(editServerId, data);
      setEditServerId(null);
    } else {
      addServer(data);
    }
    form.reset();
    setShowForm(false);
  };

  const startEdit = (serverId: string) => {
    const server = servers.find((s) => s.id === serverId);
    if (!server) return;
    form.reset({ name: server.name, url: server.url, basePath: server.basePath });
    setEditServerId(serverId);
    setShowForm(true);
  };

  const cancelForm = () => {
    form.reset(initialValues);
    setShowForm(false);
    setEditServerId(null);
  };

  return (
    <div className="lg:col-span-3">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                API Servers
              </CardTitle>
              <CardDescription>Manage and monitor your prediction API servers</CardDescription>
            </div>
            <Button
              onClick={() => {
                setShowForm(!showForm);
                setEditServerId(null);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Server
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showForm && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 border rounded-lg bg-accent/5 space-y-3">
                <div className="grid md:grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Server Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Production Server" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Server URL</FormLabel>
                        <FormControl>
                          <Input placeholder="http://localhost:8080" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="basePath"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Server Base Path</FormLabel>
                        <FormControl>
                          <Input placeholder="/api/v1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">
                    {editServerId ? "Save Changes" : "Add Server"}
                  </Button>
                  <Button type="button" variant="destructive" size="sm" onClick={cancelForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {servers.map((server) => (
              <div
                key={server.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedServerId === server.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedServerId(server.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{server.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 break-all">
                      {server.url}
                      {server.basePath}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        checkServerHealth(server.id);
                      }}
                    >
                      <RefreshCw className={`h-3 w-3 ${server.isChecking ? "animate-spin" : ""}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(server.id);
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    {servers.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeServer(server.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  {server.isChecking ? (
                    <Badge variant="outline" className="gap-2">
                      <Loader className="h-3 w-3 animate-spin" />
                      Checking...
                    </Badge>
                  ) : server.health ? (
                    <>
                      <Badge
                        variant={server.health.status === "up" ? "success" : "destructive"}
                        className="gap-2 capitalize"
                      >
                        {server.health.status === "up" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        {server.health.status}
                      </Badge>
                      {server.health.modelLoaded && (
                        <Badge variant="outline" className="text-xs">
                          Model Ready
                        </Badge>
                      )}
                    </>
                  ) : (
                    <Badge variant="outline">Not checked</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerSection;
