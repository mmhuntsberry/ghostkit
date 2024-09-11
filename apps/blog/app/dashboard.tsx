"use client";

import { Button } from "@mmhuntsberry/components";

export default async function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Button brand={process.env.NEXT_PUBLIC_SITE_TYPE}>Click me</Button>
    </div>
  );
}
