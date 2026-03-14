import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({ onToggle }: { onToggle: () => void }) {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    try {
      await login(values.email, values.password);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Login failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[340px] flex-col justify-center space-y-5 sm:max-w-sm">
      <div className="flex flex-col space-y-1.5 text-center">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Sign in to your account
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Enter your email and password below
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    className="h-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    autoComplete="current-password"
                    className="h-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          <Button
            type="submit"
            className="h-10 w-full text-sm sm:h-11 sm:text-base"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In with Email
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Create an account
        </button>
      </p>

      <p className="text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
