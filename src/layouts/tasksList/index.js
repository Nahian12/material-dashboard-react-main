import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import PropTypes from "prop-types";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

function TasksList() {

    const Author = ({ name, email }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDBox lineHeight={1}>
            <MDTypography display="block" variant="button" fontWeight="light">
              {name}
            </MDTypography>
            <MDTypography variant="caption">{email}</MDTypography>
          </MDBox>
        </MDBox>
      );

    const Coordinate = ({ latitude, longitude }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDBox lineHeight={1}>
                <MDTypography display="block" variant="caption">{latitude},</MDTypography>
                <MDTypography variant="caption">{longitude}</MDTypography>
            </MDBox>
        </MDBox>
      );
    
    // Sample data for the table
  const columns = [
    { Header: "Task ID", accessor: "task", align: "left" },
    { Header: "Created", accessor: "created", align: "left" },
    { Header: "Assigned To", accessor: "assignedTo", align: "left" },
    { Header: "Location", accessor: "location", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = [
    { task: "Task 1",
      created:  
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      22.54 - 01/11/24
        </MDTypography>
      , assignedTo: <Author name="John Michael" email="john@gmail.com" />,
      location:
      <Coordinate latitude="3.1254542" longitude="108.554851" />
      , status: (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Completed" color="success" variant="gradient" size="sm" />
        </MDBox>
      )
      ,action: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          Edit
        </MDTypography>
      ), },
      { task: "Task 2",
        created:  
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        12.14 - 25/10/24
          </MDTypography>
        , assignedTo: <Author name="Abu" email="abu@siswa.com" />,
        location:
        <Coordinate latitude="3.34454542" longitude="110.254851" />
        , status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Pending" color="dark" variant="gradient" size="sm" />
          </MDBox>
        )
        ,action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ), },
  ];

  const handleAddTask = () => {
    // Implement the logic to add a new task
    console.log("Add new task");
  };

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
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <MDTypography variant="h6" color="white">
                      Tasks List
                    </MDTypography>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<AddIcon />}
                      onClick={handleAddTask}
                    >
                      Add Task
                    </Button>
                  </Grid>
                </Grid>
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

export default TasksList;