import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      toast.error("login required");
      router.push("/login"); // Redirect to login if auth is missing
    }
  }, [router]);

  return null; // This hook doesn't need to return anything
};

export default useAuth;
