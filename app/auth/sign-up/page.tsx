"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpAction } from "@/actions/auth";

// ✅ Schema: relaxed for dev, but still validated
const signupSchema = z
  .object({
    name: z.string().min(1, "Please enter your name"),
    email: z.email("Please enter a valid email"),
    password: z.string().min(4, "Password must be at least 4 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don’t match",
    path: ["confirmPassword"],
  });

type SignupSchema = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [pending, startTnx] = useTransition()


  const router = useRouter();

  const onSubmit = async (data: SignupSchema) => {

    startTnx(async () => {
      const res = await signUpAction({ name: data.name, email: data.email, password: data.password })
      if (!res.success) {
        toast.error(res.message)
        return;
      }

      toast.success("✅ Welcome to TradeConnect!");
      router.push("/auth/sign-in"); // sign-in page
    })





  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-none border-none">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Let’s get you started 🎉</CardTitle>
            <CardDescription>
              Create your account in seconds — no paperwork, no hassle.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="e.g. Alex Rivera"
                className="h-12"
                autoComplete="name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="alex@example.com"
                className="h-12"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-12"
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="h-12"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="mt-6 flex flex-col space-y-4">
            <Button
              type="submit"
              className="h-12 w-full"
              disabled={pending}
              size="lg"
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up your account...
                </>
              ) : (
                "Create My Account"
              )}
            </Button>

            <p className="text-sm text-muted-foreground">
              Already part of the community?{" "}
              <Link
                href="/auth/sign-in"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}