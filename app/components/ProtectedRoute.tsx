import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";

export function useProtectedRoute() {
  const router = useRouter();
  const { value: token } = useLocalStorage<string>("token", "");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false); // simulate loading while checking token
  }, []);

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace("/"); // replace to prevent back navigation to protected route
    }
  }, [isLoading, token, router]);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && !token) { // page loaded from cache and no token (back navigation)
        router.replace("/");
      }
    };

    window.addEventListener("pageshow", handlePageShow); // handle back/forward navigation
    return () => window.removeEventListener("pageshow", handlePageShow); 
  }, [token, router]);

  return { isLoading }; // return null while loading to prevent flash of protected content
}