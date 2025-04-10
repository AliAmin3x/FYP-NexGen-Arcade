// /app/checkout/page.tsx or .js
"use client";

import { Suspense } from "react";
import CheckoutComponent from "./CheckoutComponent";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutComponent />
    </Suspense>
  );
}
