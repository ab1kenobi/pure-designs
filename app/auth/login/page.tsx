import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="container-pd py-24 max-w-xl">
      <p className="label">Account</p>
      <h1 className="display text-5xl mt-3">Sign in</h1>
      <div className="thread-rule-thin mt-5" />
      <LoginForm />
    </main>
  );
}
