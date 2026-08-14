import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <main className="container-pd py-24 max-w-xl">
      <p className="label">Account</p>
      <h1 className="display text-5xl mt-3">Create an account</h1>
      <div className="thread-rule-thin mt-5" />
      <SignupForm />
    </main>
  );
}
