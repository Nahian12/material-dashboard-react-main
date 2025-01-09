import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import bgPic from "assets/images/bgSignUp.png";
import { auth, database } from "../../../config/firebase_config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

function Cover() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [umId, setUmId] = useState("");
  const [role, setRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!fullName || !mobileNumber || !umId || !role) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User created:", user);

      // Save user data to Firebase Database
      await set(ref(database, "users/" + user.uid), {
        fullName: fullName,
        mobileNumber: mobileNumber,
        id: umId,
        role: role,
        email: user.email,
        rememberMe: rememberMe,
        status: "active",
      });

      console.log("User data saved to database.");
      navigate("/dashboard"); // Redirect to the dashboard after successful sign-up
    } catch (error) {
      console.error("Sign up failed:", error);
      alert("Sign up failed. Please try again.");
    }
  };

  return (
    <BasicLayout image={bgPic}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Full Name"
                fullWidth
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Mobile Number"
                fullWidth
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="UM ID Number"
                fullWidth
                value={umId}
                onChange={(e) => setUmId(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Role"
                fullWidth
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            {/* <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={() => setRememberMe(!rememberMe)}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox> */}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleSignUp}>
                Sign Up
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Cover;
