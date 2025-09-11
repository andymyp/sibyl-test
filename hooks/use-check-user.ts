/* eslint-disable react-hooks/exhaustive-deps */
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

export function useCheckUser() {
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current || user) {
      setUserLoading(false);
      return;
    }

    const supabase = createClient();

    supabase.auth
      .getUser()
      .then(({ data: { user } }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => {
        setUserLoading(false);
        didRun.current = true;
      });
  }, []);

  return { userLoading, user };
}
