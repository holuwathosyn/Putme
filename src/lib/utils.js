import axios from "axios";

import { toast } from "react-toastify";

export const handleLogout = async () => {
  try {
    const tokenitem = localStorage.getItem("token");

    const res = await axios.post(
      `/logout`,
      {},
      { headers: { Authorization: `Bearer ${tokenitem}`, "Content-Type": "application/json" } }
    );

    if (!res.ok) throw new Error("Failed to logout");

    toast.success("Logged out successfully");
    localStorage.clear();
    // window.location.href='/login';
  } catch (err) {
    console.error(err);
    toast.error("Could not logout properly.");
    localStorage.clear();
    // window.location.href='/login';
  }
};

export function formatTimeSpent(start, end) {
  const diffMs = new Date(end) - new Date(start);
  const minutes = Math.floor(diffMs / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}
