import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function useRedirect(
  guards: () => string | null,
  elseFunc?: () => void
) {
  const router = useRouter();
  const isRedirecting = useRef(false);

  useEffect(() => {
    const redirectPath = guards();

    if (!isRedirecting.current && redirectPath) {
      isRedirecting.current = true;
      return router.replace(redirectPath);
    } else {
      elseFunc?.();
    }
  }, [elseFunc, guards, router]);
}
