export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-lg space-y-6 text-center">
        <h1 className="text-3xl font-semibold">Check your email</h1>
        <p className="text-muted-foreground">
          We just sent you a secure link to sign in. The link will expire in 24 hours and can only
          be used once. If it does not arrive, check your spam folder or request a new one.
        </p>
      </div>
    </div>
  );
}
