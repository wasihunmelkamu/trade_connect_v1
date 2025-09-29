"use server";
import { api } from "@/convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import bcrypt from "bcrypt";
import { signToken, verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { Id } from "@/convex/_generated/dataModel";
import { revalidatePath } from "next/cache";

type SuccessResponse<T> = {
  success: true;
  message: "";
  data: T;
};

type ErrorResponse = {
  success: false;
  message: string;
  data: null;
};

type ServerActionResult<T> = SuccessResponse<T> | ErrorResponse;

export const serverActionWrapper = async <T>(
  fn: () => Promise<T>
): Promise<ServerActionResult<T>> => {
  try {
    const res = await fn();
    return {
      success: true,
      message: "",
      data: res,
    };
  } catch (error) {
    console.warn({ error });

    let errMsg = "Something went wrong, try again";
    if (error instanceof Error && error.message) {
      errMsg = error.message;
    }

    return {
      success: false,
      message: errMsg,
      data: null,
    };
  }
};

type SignUpAction = {
  name: string;
  email: string;
  password: string;
};

export const signUpAction = async ({ name, email, password }: SignUpAction) =>
  serverActionWrapper(async () => {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await fetchQuery(api.users.getUserByEmail, {
      email: email,
    });
    if (existingUser) {
      throw new Error(" email is already taken  ");
    }

    // create user
    const res = await fetchMutation(api.users.createUser, {
      name,
      email,
      password: hashedPassword,
    });

    if (!res) {
      throw new Error("Creating a user failed");
    }

    const profile = await fetchMutation(api.users.createProfile, {
      name,
      email,
      userId: res._id,
      location: "",
    });

    if (!profile) {
      throw new Error("Creating a user profile failed");
    }

    // sign token
    const token = await signToken({
      userId: res._id,
      role: res.role,
    });

    const cookie = await cookies();
    cookie.set("token", token);

    // Return data you want client to get
    return {
      user: res,
      token,
    };
  });

export const signInAction = async ({
  email,
  password,
}: Omit<SignUpAction, "name">) =>
  serverActionWrapper(async () => {
    console.log({ email, password });
    const res = await fetchQuery(api.users.getUserByEmail, {
      email,
    });

    console.log({ res });

    if (!res) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(password, res.password);

    if (!isValidPassword) {
      throw new Error("Incorrect password, try again");
    }

    // sign token
    const token = await signToken({
      userId: res._id,
      role: res.role,
    });

    const profile = await fetchQuery(api.users.getUser, {
      userId: res._id,
    });

    const cookie = await cookies();
    cookie.set("token", token);

    return {
      user: profile,
      token,
    };
  });

export const signInAction2 = async ({
  password,
  hashedPassword,
  userId,
  role,
}: {
  userId: Id<"users">;
  role: "admin" | "user";
  password: string;
  hashedPassword: string;
}) =>
  serverActionWrapper(async () => {
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      throw new Error("Incorrect password, try again");
    }

    // sign token
    const token = await signToken({
      userId: userId,
      role: role,
    });

    const cookie = await cookies();
    cookie.set("token", token);

    return {
      token,
    };
  });

export const verifyUser = async () => {
  return serverActionWrapper(async () => {
    const cookie = await cookies();
    const token = cookie.get("token")?.value;

    if (!token) {
      throw new Error("Not authorized, try later.");
    }

    const payload = await verifyToken(token);

    const user = await fetchQuery(api.users.getUser, {
      userId: payload.userId as Id<"users">,
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  });
};

export const signOutAction = async () => {
  const cookie = await cookies();
  cookie.delete("token");
  revalidatePath("/", "layout");
};
