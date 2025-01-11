import { useState, useEffect } from "react";
import { getAuth, deleteUser } from "firebase/auth";
import { ref, get, remove, update } from "firebase/database";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React context
import { useMaterialUIController, setDarkMode } from "context";

import { database } from "config/firebase_config";

function PlatformSettings() {
  const [status, setStatus] = useState(true); // Default to active
  const [darkModeEnabled, setDarkModeEnabled] = useState(false); // Local state for dark mode
  const [controller, dispatch] = useMaterialUIController();
  const { darkMode } = controller;

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userRef = ref(database, `users/${currentUser.uid}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setStatus(userData.status === "active");
          const userMode = userData.mode === "dark"; // Check if mode is "dark"
          setDarkModeEnabled(userMode);
          setDarkMode(dispatch, userMode); // Set the initial theme mode
        }
      });
    }
  }, [dispatch]);

  const handleStatusToggle = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const newStatus = status ? "inactive" : "active";
      const userRef = ref(database, `users/${currentUser.uid}`);

      update(userRef, { status: newStatus })
        .then(() => {
          setStatus(!status);
        })
        .catch((error) => {
          console.error("Error updating status:", error);
        });
    }
  };

  const handleDarkModeToggle = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const newMode = darkModeEnabled ? "light" : "dark";
      const userRef = ref(database, `users/${currentUser.uid}`);

      update(userRef, { mode: newMode })
        .then(() => {
          setDarkMode(dispatch, newMode === "dark");
          setDarkModeEnabled(newMode === "dark");
        })
        .catch((error) => {
          console.error("Error updating mode:", error);
        });
    }
  };

  const handleDeleteAccount = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userRef = ref(database, `users/${currentUser.uid}`);
      remove(userRef)
        .then(() => {
          deleteUser(currentUser)
            .then(() => {
              console.log("Account deleted successfully");
              alert("Your account has been deleted.");
              window.location.reload(); 
            })
            .catch((error) => {
              console.error("Error deleting user:", error);
              alert("Error deleting your account. Please try again.");
            });
        })
        .catch((error) => {
          console.error("Error removing user from database:", error);
          alert("Error deleting your account data. Please try again.");
        });
    }
  };

  return (
    <Card sx={{ boxShadow: "none" }}>
      <MDBox p={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          platform settings
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          account
        </MDTypography>
        {/* Status toggle */}
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={status} onChange={handleStatusToggle} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              {status ? "Active" : "Inactive"}
            </MDTypography>
          </MDBox>
        </MDBox>
        {/* Dark Mode toggle */}
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={darkModeEnabled} onChange={handleDarkModeToggle} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              {darkModeEnabled ? "Dark Mode" : "Light Mode"}
            </MDTypography>
          </MDBox>
        </MDBox>
        {/* Delete Account */}
        <MDBox mt={3}>
          <MDButton
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleDeleteAccount}
          >
            Delete Account
          </MDButton>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default PlatformSettings;
