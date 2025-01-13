import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { database } from "config/firebase_config";
import { ref, onValue } from "firebase/database";

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        const sortedUsers = usersList.sort((a, b) => (b.completedThisMonth || 0) - (a.completedThisMonth || 0));
        setUsers(sortedUsers);
      }
    });
  }, []);

  const columns = [
    { Header: "Rank", accessor: "rank", align: "center" },
    { Header: "Name", accessor: "fullName", align: "left" },
    { Header: "Email", accessor: "email", align: "left" },
    { Header: "Completed Tasks (This Month)", accessor: "completedThisMonth", align: "center" },
  ];

  const rows = users.map((user, index) => {
    // Determine the medal for top 3 ranks
    let rankDisplay;
    if (index === 0) {
      rankDisplay = "🥇"; // Gold medal
    } else if (index === 1) {
      rankDisplay = "🥈"; // Silver medal
    } else if (index === 2) {
      rankDisplay = "🥉"; // Bronze medal
    } else {
      rankDisplay = index + 1; // Default rank as a number
    }
  
    // Truncate fullName if it's more than 40 characters
    const fullNameDisplay =
      user.fullName && user.fullName.length > 30
        ? `${user.fullName.substring(0, 30)}...`
        : user.fullName || "N/A";
  
    return {
      rank: rankDisplay,
      fullName: fullNameDisplay,
      email: user.email || "N/A",
      completedThisMonth: user.completedThisMonth || 0,
    };
  });
  
  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Leaderboard
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Leaderboard;