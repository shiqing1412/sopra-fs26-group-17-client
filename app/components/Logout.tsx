import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";

export default function Logout() {
    const router = useRouter();
    const apiService = useApi();
    const { clear: clearUser } = useLocalStorage<User | null>("user", null);
    const { value: token, clear: clearToken} = useLocalStorage<string>("token", "");

    const handleLogout = async (): Promise<void> => {
        try {
        const cleanToken = token ? JSON.parse(token) : null;
        if (cleanToken) { //logout by uniqe user token
            await apiService.post<User>("/logout", { token: cleanToken });
        }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            alert(`Something went wrong during the logout:\n${message}`);
        }  finally {
        clearToken();
        clearUser();
        router.replace("/login")
        }
    };

    return { handleLogout };
}