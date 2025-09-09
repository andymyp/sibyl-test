"use client";

import { createContext, useContext } from "react";
import { User } from "@supabase/supabase-js";

const AuthContext = createContext<User | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useUser() {
  const user = useContext(AuthContext);

  if (!user) {
    throw new Error("AuthProvider is missing or user is null");
  }

  return user;
}
