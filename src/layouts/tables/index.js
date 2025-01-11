import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { database } from "config/firebase_config"; // Database Path
import { ref, onValue, update, remove, push } from "firebase/database";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import Tooltip from "@mui/material/Tooltip";

function Tables() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUserUID, setEditingUserUID] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isAddingNew, setIsAddingNew] = useState(false); // Track if adding a new user
  const [errorMessages, setErrorMessages] = useState({});

  
  const handleAddStaff = () => {
    // Create a blank entry for the new staff row
    setEditFormData({
      fullName: "",  // Initialize fullName
      email: "",     // Initialize email
      role: "",      // Initialize role
      status: "",    // Initialize status
      mobileNumber: "" // Initialize mobileNumber
    });
    setIsAddingNew(true); // Enable adding mode
  };
  

  const validateInputs = () => {
    const errors = {};

    if (!editFormData.id) {
      errors.id = "ID is required.";
    }  
    if (!editFormData.fullName) {
      errors.fullName = "Name is required.";
    }
    if (!editFormData.email) {
      errors.email = "Email is required.";
    }
    if (!editFormData.role) {
      errors.role = "Role is required.";
    }
    if (!editFormData.status) {
      errors.status = "Status is required.";
    }
    if (!editFormData.mobileNumber) {
      errors.mobileNumber = "Mobile Number is required.";
    }
  
    setErrorMessages(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };
  
  

  useEffect(() => {
    console.log("Setting up Firebase listener...");
    const usersRef = ref(database, "users"); // Target the 'users' node specifically
    onValue(
      usersRef,
      (snapshot) => {
        console.log("Firebase snapshot received.");
        const data = snapshot.val();
        console.log("Fetched data:", data); // Debugging log
        if (data) {
          const usersList = Object.keys(data).map((key) => ({
            uid: key,
            ...data[key],
          }));
          console.log("Processed users list:", usersList); // Debugging log
          setUsers(usersList);
        } else {
          console.log("No data available.");
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }, []);

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditingUserUID(user.edit);
    setEditFormData(user);
    console.log(user.edit)
  };

  const handleSaveClick = async () => {
    if (!validateInputs()) {
      return;
    }
  
    try {
      if (isAddingNew) {
        const newUserRef = push(ref(database, "users"));
        await update(newUserRef, {
          id: editFormData.id || "",
          fullName: editFormData.fullName || "",
          email: editFormData.email || "",
          role: editFormData.role || "",
          status: editFormData.status || "",
          mobileNumber: editFormData.mobileNumber || "",
        });
        setIsAddingNew(false);
        setEditingUserId(null);
        setEditFormData({});
        setEditingUserUID(null);
      } else {
        // Editing an existing user
        const userRef = ref(database, `users/${editingUserUID}`);
        const updatedData = {
          fullName: editFormData.fullName || "",
          email: editFormData.email || "",
          role: editFormData.role || "",
          status: editFormData.status || "",
          mobileNumber: editFormData.mobileNumber || "",
          rememberMe: editFormData.rememberMe !== undefined ? editFormData.rememberMe : false,
        };
        await update(userRef, updatedData);
        setEditingUserId(null);
        setEditingUserUID(null);
        // Update the local state to reflect the changes
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === editingUserId ? { ...user, ...updatedData } : user))
        );
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  
  const handleCancelClick = () => {
    if (isAddingNew) {
      setIsAddingNew(false); // Exit adding mode
      setEditFormData({}); // Clear the form data
    } else {
      setEditingUserId(null);
      setEditingUserUID(null);
      setEditFormData({});
    }
  };
  

  const handleDeleteClick = async () => {
    try {
      const userRef = ref(database, `users/${editingUserUID}`);
      await remove(userRef);
      setEditingUserId(null);
      setEditingUserUID(null);
      // Update the local state to remove the deleted user
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== editingUserId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const columns = [
    { Header: "ID", accessor: "id", width: "5%" },
    { Header: "Name", accessor: "fullName", width: "20%" },
    { Header: "Email", accessor: "email", width: "20%" },
    { Header: "Mobile Number", accessor: "mobileNumber", width: "20%", align: "center" },
    { Header: "Role", accessor: "role", width: "5%", align: "center" },
    { Header: "Status", accessor: "status", width: "5%", align: "center" },
    {
      Header: "Edit",
      accessor: "edit",
      width: "20%",
      align: "center",
      Cell: ({ row }) =>
        isAddingNew && row.original.edit === "new" ? (
          <div>
            <MDButton onClick={handleSaveClick} color="success" sx={{ mr: 0.5 }}>
              Save
            </MDButton>
            <MDButton onClick={handleCancelClick} color="warning">
              Cancel
            </MDButton>
          </div>
        ) : editingUserId === row.original.id ? (
          <div>
            <MDButton onClick={handleSaveClick} color="success" sx={{ mr: 0.5 }}>
              Save
            </MDButton>
            <MDButton onClick={handleCancelClick} color="warning" sx={{ mr: 0.5 }}>
              Cancel
            </MDButton>
            <MDButton onClick={handleDeleteClick} color="error">
              Delete
            </MDButton>
          </div>
        ) : (
          <MDButton onClick={() => handleEditClick(row.original)} color="info">
            Edit
          </MDButton>
        ),
    },
  ];
  
  const rows = [
    ...(isAddingNew
      ? [
          {
            id: (
              <MDBox mb={2}>
                <MDInput
                  name="id"
                  value={editFormData.id}
                  onChange={handleInputChange}
                  label="ID"
                  fullWidth
                />
                {errorMessages.id && (
                  <MDTypography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                    {errorMessages.id}
                  </MDTypography>
                )}
              </MDBox>
            ),
            fullName: (
              <MDBox mb={2}>
                <MDInput
                  name="fullName"
                  value={editFormData.fullName || ""} // Updated to use fullName
                  onChange={handleInputChange}
                  label="Name"
                  fullWidth
                />
                {errorMessages.fullName && (
                  <MDTypography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                    {errorMessages.fullName}
                  </MDTypography>
                )}
              </MDBox>
            ),
            email: (
              <MDBox mb={2}>
                <MDInput
                  name="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                  label="Email"
                  fullWidth
                />
                {errorMessages.email && (
                  <MDTypography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                    {errorMessages.email}
                  </MDTypography>
                )}
              </MDBox>
            ),
            mobileNumber: (
              <MDBox mb={2}>
                <MDInput
                  name="mobileNumber"
                  value={editFormData.mobileNumber || ""}
                  onChange={handleInputChange}
                  label="Mobile Number"
                  fullWidth
                />
                {errorMessages.mobileNumber && (
                  <MDTypography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                    {errorMessages.mobileNumber}
                  </MDTypography>
                )}
              </MDBox>
            ),
            role: (
              <MDBox mb={2}>
                <MDInput
                  name="role"
                  value={editFormData.role}
                  onChange={handleInputChange}
                  label="Role"
                  
                />
                {errorMessages.role && (
                  <MDTypography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                    {errorMessages.role}
                  </MDTypography>
                )}
              </MDBox>
            ),
            status: (
              <MDBox mb={2}>
                <MDInput
                  name="status"
                  value={editFormData.status}
                  onChange={handleInputChange}
                  label="Status"
                  
                />
                {errorMessages.status && (
                  <MDTypography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                    {errorMessages.status}
                  </MDTypography>
                )}
              </MDBox>
            ),
            edit: "new",
          },
        ]
      : []),
    ...users.map((user) => ({
      id: user.id,
      fullName:
        editingUserId === user.id ? (
          <MDBox mb={2}>
            <MDInput
              name="fullName"
              value={editFormData.fullName || ""} // Updated to use fullName
              onChange={handleInputChange}
              label="Name"
              fullWidth
            />
            {errorMessages.fullName && (
              <MDTypography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                {errorMessages.fullName}
              </MDTypography>
            )}
          </MDBox>
        ) : (
          user.fullName.length > 25 ? (
            <Tooltip title={user.fullName}>
              <span>{`${user.fullName.substring(0, 25)}...`}</span>
            </Tooltip>
          ) : (
            user.fullName
          )
        ),
      email:
        editingUserId === user.id ? (
          <MDBox mb={2}>
            <MDInput
              name="email"
              value={editFormData.email}
              onChange={handleInputChange}
              label="Email"
              fullWidth
            />
            {errorMessages.email && (
              <MDTypography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                {errorMessages.email}
              </MDTypography>
            )}
          </MDBox>
        ) : (
          user.email.length > 25 ? (
            <Tooltip title={user.email}>
              <span>{`${user.email.substring(0, 25)}...`}</span>
            </Tooltip>
          ) : (
            user.email
          )
        ),
      mobileNumber:
        editingUserId === user.id ? (
          <MDBox mb={2}>
            <MDInput
              name="mobileNumber"
              value={editFormData.mobileNumber || ""}
              onChange={handleInputChange}
              label="Mobile Number"
              fullWidth
            />
            {errorMessages.mobileNumber && (
              <MDTypography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                {errorMessages.mobileNumber}
              </MDTypography>
            )}
          </MDBox>
        ) : (
          user.mobileNumber
        ),
      role:
        editingUserId === user.id ? (
          <MDBox mb={2}>
            <MDInput
              name="role"
              value={editFormData.role}
              onChange={handleInputChange}
              label="Role"
              fullWidth
            />
            {errorMessages.role && (
              <MDTypography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                {errorMessages.role}
              </MDTypography>
            )}
          </MDBox>
        ) : (
          user.role
        ),
      status:
        editingUserId === user.id ? (
          <MDBox mb={2}>
            <MDInput
              name="status"
              value={editFormData.status}
              onChange={handleInputChange}
              label="Status"
              fullWidth
            />
            {errorMessages.status && (
              <MDTypography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                {errorMessages.status}
              </MDTypography>
            )}
          </MDBox>
        ) : (
          user.status
        ),
      edit: user.uid,
    })),
  ];

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
                      Staff List
                    </MDTypography>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<AddIcon />}
                      onClick={handleAddStaff}
                    >
                      Add Staff
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

Tables.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string,
      role: PropTypes.string,
      status: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default Tables;