"use client";

import { SWRConfig } from "swr";
import type { ReactNode } from "react";
import { fetcher } from "@/lib/api";

export function Providers({ children }: { children: ReactNode }) {
  return <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>{children}</SWRConfig>;
}
