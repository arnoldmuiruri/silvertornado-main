import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "DCM Services — Geographic Portfolio Analyzer" },
      {
        name: "description",
        content:
          "Pilot study of Census Tract 9801, Hennepin County MN: cross-entity matching for unresolved deceased portfolios.",
      },
    ],
  }),
});
