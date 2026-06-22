import SignInForm from "@/components/SigninForm";
import { Suspense } from "react";


export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm/>
    </Suspense>
  );
}