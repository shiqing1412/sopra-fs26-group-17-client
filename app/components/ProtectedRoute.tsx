import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";

export function useProtectedRoute() {
  const router = useRouter();
  const { value: token } = useLocalStorage<string>("token", "");

  useEffect(() => {
    if (!token) {
      router.replace("/"); // replace to prevent back navigation to protected route
    }
  }, [token, router]);
}