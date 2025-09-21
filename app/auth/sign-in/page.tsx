"use client";

import React, { useEffect, useState } from "react";
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
import { signInAction, signInAction2 } from "@/actions/auth";
import { useAuthUser, useSetAuthUser } from "@/contexts/AuthGuard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DebugJson from "@/components/debugJSON";

// ✅ Sign-in schema
const signinSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type SigninSchema = z.infer<typeof signinSchema>;

export default function SigninPage() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pending, setPending] = useState(false)
  const [isGettingProfile, setIsGettingProfile] = useState(false)

  const user = useQuery(api.users.getUserByEmail, email ? { email: email } : "skip")

  const userProfile = useQuery(api.users.getUser, isGettingProfile && user?._id ? { userId: user._id } : "skip")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const setAuthUser = useSetAuthUser()

  const signInHandler = async () => {
    if (!email) {
      setPending(false)
      return;
    }

    if (!user) {
      toast.error("User not found, please sign up to continue.")
      setPending(false)
      return;
    }

    setPending(true)
    const response = await signInAction2({
      userId: user._id,
      role: user.role,
      hashedPassword: user.password,
      password: password,
    })

    if (!response.success) {
      setPending(false)
      toast.error(response.message)
    }


    // Get profile
    setIsGettingProfile(true)

    console.log({ response })
  }


  useEffect(() => {
    if (isGettingProfile) {
      return;
    }

  }, [isGettingProfile])

  useEffect(() => {
    signInHandler()
  }, [user])


  useEffect(() => {
    if (!userProfile || !user) {
      return;
    }

    setAuthUser({
      id: user._id,
      name: user.name,
      displayName: userProfile.displayName || "",
      email: user.email,
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt,
      isVerified: userProfile.isVerified || false,
      role: user.role
    })
    setPending(false)
    toast.success("✅ Welcome back! Glad to see you.");
    router.push("/dashboard");
  }, [userProfile])

  const onSubmit = async (data: SigninSchema) => {
    setPending(true)
    setEmail(data.email)
    setPassword(data.password)
  };

  // const onSubmit = async (data: SigninSchema) => {
  //   if (!email) {
  //     setEmail(data.email)
  //     return;
  //   }
  //   const res = await signInAction(data);

  //   if (!res.success) {
  //     toast.error(`🚫 ${res.message}`);
  //     return;
  //   }

  //   const user = res.data.user

  //   if (!user) {
  //     toast.error(`🚫 User data not found.`);
  //     return;
  //   }

  //   setAuthUser({
  //     id: user._id,
  //     name: user.name,
  //     displayName: user.displayName || "",
  //     email: user.email,
  //     createdAt: user.createdAt,
  //     updatedAt: user.updatedAt,
  //     isVerified: user.isVerified || false,
  //     role: user.role
  //   })
  //   toast.success("✅ Welcome back! Glad to see you.");
  //   router.push("/dashboard");
  // };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <DebugJson data={{ user }} />
      <Card className="w-full max-w-sm border-none">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome back 👋</CardTitle>
            <CardDescription>
              Sign in to continue where you left off.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
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
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="mt-6 flex flex-col space-y-4">
            <Button
              type="submit"
              className="h-12 w-full"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing you in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}