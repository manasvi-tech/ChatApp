import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useLogout = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const logout = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/auth/logout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});

			if (!res.ok) {
				// If the status code is not 2xx, throw an error
				const errorData = await res.json();
				throw new Error(errorData.error || "Logout failed");
			}

			const data = await res.json();
			console.log("Logout response:", data);

			// Successfully logged out
			localStorage.removeItem("chat-item");
			setAuthUser(null);
			toast.success("Logged out successfully");
		} catch (error) {
			console.log("Logout error:", error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, logout };
};

export default useLogout;
