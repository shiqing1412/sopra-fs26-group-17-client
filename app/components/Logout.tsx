import { useApi } from "@/hooks/useApi";
import { showError } from "@/utils/showError";
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
        if (token) { //logout by uniqe user token
            await apiService.post<User>("/logout", {});
        }
        } catch (error) {
            showError(error, "Something went wrong during logout.");
        }  finally {
        clearToken();
        clearUser();
        router.replace("/login")
        }
    };

    return { handleLogout };
}