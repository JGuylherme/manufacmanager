'use client';

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#111",
        },
        success: {
          style: {
            border: "1px solid #22c55e",
          },
        },
        error: {
          style: {
            border: "1px solid #ef4444",
          },
        },
      }}
    />
  );
}
