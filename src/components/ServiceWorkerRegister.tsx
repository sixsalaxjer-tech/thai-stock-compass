"use client";

import { useEffect } from "react";
import { basePath } from "@/lib/basePath";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    navigator.serviceWorker.register(`${basePath}/sw.js`).catch(() => {
      // registration failure shouldn't break the page
    });
  }, []);

  return null;
}
