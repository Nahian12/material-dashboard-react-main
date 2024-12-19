import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "config/firebase_config";
import { signOut } from "firebase/auth";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        console.log("User signed out successfully.");
        navigate("/authentication/sign-in");
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Logout failed. Please try again.");
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div>
      <h3>Logging out...</h3>
    </div>
  );
}

export default Logout;
