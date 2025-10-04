"use client";

import dynamic from "next/dynamic";

// Load the browser-only form with SSR disabled
const SignInForm = dynamic(() => import("./SignInForm"), { ssr: false });

export default function SignInPage() {
  return <SignInForm />;
}
