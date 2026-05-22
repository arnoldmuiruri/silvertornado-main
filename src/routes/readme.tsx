import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/readme")({
  component: () => <Navigate to="/" />,
});
