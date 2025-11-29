import Header from "@/components/header";
import { ApiProvider } from "@/providers/api-provider";
import { ServerProvider } from "@/providers/server-provider";
import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import React from "react";

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import("@tanstack/react-router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      }))
    );

const RootLayout = () => (
  <>
    <HeadContent />
    <ServerProvider>
      <ApiProvider>
        <div className="min-h-screen bg-linear-to-br from-background via-accent/5 to-background">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Outlet />
          </main>
        </div>
      </ApiProvider>
    </ServerProvider>
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
