import { useSearchParams } from "next/navigation";
import { message } from "antd";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DeletedTripNotifier: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // online members: after polling
    const deleted = searchParams.get("deleted");
    if (deleted) {
      message.info(`Trip "${deleted}" was deleted by the owner.`);
      router.replace("/trips");
      return;
    }

    // offline members: after logging in
    const deletedTrip = localStorage.getItem("deletedTrip");
    if (deletedTrip) {
      message.info(`Trip "${deletedTrip}" was deleted by the owner.`);
      localStorage.removeItem("deletedTrip");
    }
  }, [searchParams, router]);

  return null;
}

export default DeletedTripNotifier;