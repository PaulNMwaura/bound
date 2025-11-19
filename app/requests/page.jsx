// app/requests/page.tsx (server component by default)
import { Suspense } from "react";
import Requests from "./RequestsClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Requests />
    </Suspense>
  );
}
