import { Suspense } from "react";

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="p-8">Loading registration…</div>}>{children}</Suspense>;
}
