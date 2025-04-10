// app/discover/page.js
import { Suspense } from "react";
import DiscoverClient from "./DiscoverClient";

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DiscoverClient />
    </Suspense>
  );
}
