import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";

const { value: user, clear: clearUser } = useLocalStorage<User | null>("user", null);
const { value: token, clear: clearToken} = useLocalStorage<string>("token", "");

export default function Logout() {
    const router = useRouter();
    const apiService = useApi();

    const handleLogout = async (): Promise<void> => {
        try {
        const cleanToken = token ? JSON.parse(token) : null;
        if (cleanToken) { //logout by uniqe user token
            await apiService.post<User>("/logout", { token: cleanToken });
        }
        } catch (error : any) {
        alert(`Something went wrong during the logout:\n${error.message}`);
        }  finally {
        clearToken();
        clearUser();
        router.push("/login")
        }
    };

    return { handleLogout };
}