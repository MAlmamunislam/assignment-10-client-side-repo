import { Suspense } from "react";

import RegisterForm from "@/components/SignUpForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm/>
    </Suspense>
  );
}