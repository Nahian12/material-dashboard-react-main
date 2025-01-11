import { database } from "config/firebase_config";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import { getAuth } from "firebase/auth";
import { ref as dbRef, get, update } from "firebase/database";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

function Overview() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = dbRef(database, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.profilePicture === "local") {
            const localImage = localStorage.getItem("profilePicture");
            setUserData({ ...data, profilePicture: localImage });
          } else {
            setUserData(data);
          }
        } else {
          console.error("No user data found");
        }
      } else {
        console.error("No authenticated user");
      }
    };

    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);

    if (!isEditing) {
      // Populate edit form data with current user data
      setEditData({
        fullName: userData.fullName || "",
        mobile: userData.mobileNumber || "",
        id: userData.id || "",
        role: userData.role || "",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userRef = dbRef(database, `users/${currentUser.uid}`);
      await update(userRef, editData);

      setUserData((prevData) => ({ ...prevData, ...editData }));
      setIsEditing(false);
    } else {
      console.error("No authenticated user");
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("No file selected. Please choose a valid image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const base64Image = e.target.result;

        // Save the image to localStorage
        localStorage.setItem("profilePicture", base64Image);

        // Save the link (or relative path) to the database
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
          await update(dbRef(database, `users/${currentUser.uid}`), {
            profilePicture: "local", // You can save a relative link like "local"
          });

          // Update local state
          setUserData((prevData) => ({
            ...prevData,
            profilePicture: base64Image,
          }));

          alert("Profile picture updated successfully!");
        } else {
          alert("User not authenticated");
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("Failed to upload profile picture. Please try again.");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4}>
              <PlatformSettings />
            </Grid>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              {userData ? (
                <ProfileInfoCard
                  title="Profile Information"
                  description={
                    isEditing
                      ? "Edit your profile information"
                      : `Welcome ${userData.fullName || "User"} to your profile page.`
                  }
                  info={
                    isEditing
                      ? {
                          fullName: (
                            <MDInput
                              label="Full Name"
                              name="fullName"
                              value={editData.fullName || ""}
                              onChange={handleInputChange}
                              fullWidth
                            />
                          ),
                          mobile: (
                            <MDInput
                              label="Mobile Number"
                              name="mobile"
                              value={editData.mobile || ""}
                              onChange={handleInputChange}
                              fullWidth
                            />
                          ),
                          email: (
                            <MDTypography variant="caption" color="text" fontWeight="medium">
                              {userData.email || "N/A"}
                            </MDTypography>
                          ),
                          id: (
                            <MDInput
                              label="ID"
                              name="id"
                              value={editData.id || ""}
                              onChange={handleInputChange}
                              fullWidth
                            />
                          ),
                          role: (
                            <MDInput
                              label="Role"
                              name="role"
                              value={editData.role || ""}
                              onChange={handleInputChange}
                              fullWidth
                            />
                          ),
                          save: (
                            <MDBox mt={2}>
                              <MDButton variant="gradient" color="info" onClick={handleSave}>
                                Save
                              </MDButton>
                            </MDBox>
                          ),
                        }
                      : {
                          fullName: userData.fullName || "N/A",
                          mobile: userData.mobileNumber || "N/A",
                          email: userData.email || "N/A",
                          id: userData.id || "N/A",
                          role: userData.role || "N/A",
                        }
                  }
                  
                  action={{
                    route: "#",
                    tooltip: isEditing ? "Save Changes" : "Edit Profile",
                    onClick: () => {
                      if (isEditing) {
                        handleSave(); // Save the edited data
                      } else {
                        handleEditToggle(); // Toggle to edit mode
                      }
                    },
                  }}                                   
                  shadow={false}
              />
              ) : (
                <MDTypography variant="h6" fontWeight="medium" color="text">
                  Loading user data...
                </MDTypography>
              )}
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid item xs={12} xl={4}>
              <MDBox>
                <MDTypography variant="h6" fontWeight="medium">
                  Upload Profile Picture
                </MDTypography>
                {userData?.profilePicture ? (
                  <MDBox mt={2} mb={2}>
                    <img
                      src={userData.profilePicture}
                      alt="Profile"
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  </MDBox>
                ) : (
                  <MDTypography variant="button" color="text">
                    No profile picture uploaded yet.
                  </MDTypography>
                )}
                <MDBox mt={2}>
                  <MDButton
                    variant="outlined"
                    color="info"
                    component="label"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Choose Picture"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleUpload}
                    />
                  </MDButton>
                </MDBox>
              </MDBox>
              {isEditing && (
                <MDBox mt={2}>
                  <MDInput
                    label="Full Name"
                    name="fullName"
                    value={editData.fullName || ""}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <MDInput
                    label="Mobile Number"
                    name="mobile"
                    value={editData.mobile || ""}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                  <MDInput
                    label="ID"
                    name="id"
                    value={editData.id || ""}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                  <MDInput
                    label="Role"
                    name="role"
                    value={editData.role || ""}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                </MDBox>
              )}
            </Grid>
          </Grid>
        </MDBox>
      </Header>
    </DashboardLayout>
  );
}

export default Overview;
