// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
// import DataTable from "examples/Tables/DataTable";
// import { database } from "config/firebase_config"; // Ensure this path is correct
// import { ref, onValue, update, remove } from "firebase/database";
// import MDButton from "components/MDButton";
// import MDInput from "components/MDInput";

// function Tables() {
//   const [users, setUsers] = useState([]);
//   const [editingUserId, setEditingUserId] = useState(null);
//   const [editFormData, setEditFormData] = useState({});

//   useEffect(() => {
//     console.log("Setting up Firebase listener...");
//     const usersRef = ref(database, "users"); // Target the 'users' node specifically
//     onValue(
//       usersRef,
//       (snapshot) => {
//         console.log("Firebase snapshot received.");
//         const data = snapshot.val();
//         console.log("Fetched data:", data); // Debugging log
//         if (data) {
//           const usersList = Object.keys(data).map((key) => ({
//             id: key,
//             ...data[key],
//           }));
//           console.log("Processed users list:", usersList); // Debugging log
//           setUsers(usersList);
//         } else {
//           console.log("No data available.");
//         }
//       },
//       (error) => {
//         console.error("Error fetching data:", error);
//       }
//     );
//   }, []);

//   const handleEditClick = (user) => {
//     setEditingUserId(user.id);
//     setEditFormData(user);
//   };

//   const handleSaveClick = async () => {
//     try {
//       const userRef = ref(database, `users/${editingUserId}`);
//       await update(userRef, editFormData);
//       setEditingUserId(null);
//     } catch (error) {
//       console.error("Error updating user:", error);
//     }
//   };

//   const handleCancelClick = () => {
//     setEditingUserId(null);
//   };

//   const handleDeleteClick = async () => {
//     try {
//       const userRef = ref(database, `users/${editingUserId}`);
//       await remove(userRef);
//       setEditingUserId(null);
//     } catch (error) {
//       console.error("Error deleting user:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditFormData({ ...editFormData, [name]: value });
//   };

//   const columns = [
//     { Header: "ID", accessor: "id", width: "10%" },
//     { Header: "Email", accessor: "email", width: "30%" },
//     { Header: "Role", accessor: "role", width: "20%" },
//     { Header: "Status", accessor: "status", width: "20%" },
//     {
//       Header: "Edit",
//       accessor: "edit",
//       width: "20%",
//       Cell: ({ row }) =>
//         editingUserId === row.original.id ? (
//           <div>
//             <MDButton onClick={handleSaveClick} color="success">
//               Save
//             </MDButton>
//             <MDButton onClick={handleCancelClick} color="warning">
//               Cancel
//             </MDButton>
//             <MDButton onClick={handleDeleteClick} color="error">
//               Delete
//             </MDButton>
//           </div>
//         ) : (
//           <MDButton onClick={() => handleEditClick(row.original)} color="info">
//             Edit
//           </MDButton>
//         ),
//     },
//   ];

//   const rows = users.map((user) => ({
//     id: user.id,
//     email:
//       editingUserId === user.id ? (
//         <MDInput name="email" value={editFormData.email} onChange={handleInputChange} />
//       ) : (
//         user.email
//       ),
//     role:
//       editingUserId === user.id ? (
//         <MDInput name="role" value={editFormData.role} onChange={handleInputChange} />
//       ) : (
//         user.role
//       ),
//     status:
//       editingUserId === user.id ? (
//         <MDInput name="status" value={editFormData.status} onChange={handleInputChange} />
//       ) : (
//         user.status
//       ),
//     edit: user.id,
//   }));

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <MDBox pt={6} pb={3}>
//         <Grid container spacing={6}>
//           <Grid item xs={12}>
//             <Card>
//               <MDBox
//                 mx={2}
//                 mt={-3}
//                 py={3}
//                 px={2}
//                 variant="gradient"
//                 bgColor="info"
//                 borderRadius="lg"
//                 coloredShadow="info"
//               >
//                 <MDTypography variant="h6" color="white">
//                   Users Table
//                 </MDTypography>
//               </MDBox>
//               <MDBox pt={3}>
//                 <DataTable
//                   table={{ columns, rows }}
//                   isSorted={false}
//                   entriesPerPage={false}
//                   showTotalEntries={false}
//                   noEndBorder
//                 />
//               </MDBox>
//             </Card>
//           </Grid>
//         </Grid>
//       </MDBox>
//       <Footer />
//     </DashboardLayout>
//   );
// }

// Tables.propTypes = {
//   row: PropTypes.shape({
//     original: PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       email: PropTypes.string,
//       role: PropTypes.string,
//       status: PropTypes.string,
//     }).isRequired,
//   }).isRequired,
// };

// export default Tables;
// // Compare this snippet from src/config/firebase_config.js:

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
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { database } from "config/firebase_config"; // Ensure this path is correct
import { ref, onValue, update, remove } from "firebase/database";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

function Tables() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const handleAddStaff = () => {
    // Implement the logic to add new staff
    console.log("Add new staff");
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
            id: key,
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
    setEditFormData(user);
  };

  const handleSaveClick = async () => {
    try {
      const userRef = ref(database, `users/${editingUserId}`);
      const updatedData = {
        email: editFormData.email,
        role: editFormData.role,
        status: editFormData.status,
        rememberMe: editFormData.rememberMe !== undefined ? editFormData.rememberMe : false,
      };
      await update(userRef, updatedData);
      setEditingUserId(null);
      // Update the local state to reflect the changes
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === editingUserId ? { ...user, ...updatedData } : user))
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const handleCancelClick = () => {
    setEditingUserId(null);
  };

  const handleDeleteClick = async () => {
    try {
      const userRef = ref(database, `users/${editingUserId}`);
      await remove(userRef);
      setEditingUserId(null);
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
    { Header: "ID", accessor: "id", width: "10%" },
    { Header: "Email", accessor: "email", width: "30%" },
    { Header: "Role", accessor: "role", width: "20%" },
    { Header: "Status", accessor: "status", width: "20%" },
    {
      Header: "Edit",
      accessor: "edit",
      width: "20%",
      Cell: ({ row }) =>
        editingUserId === row.original.id ? (
          <div>
            <MDButton onClick={handleSaveClick} color="success">
              Save
            </MDButton>
            <MDButton onClick={handleCancelClick} color="warning">
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

  const rows = users.map((user) => ({
    id: user.id,
    email:
      editingUserId === user.id ? (
        <MDInput name="email" value={editFormData.email} onChange={handleInputChange} />
      ) : (
        user.email
      ),
    role:
      editingUserId === user.id ? (
        <MDInput name="role" value={editFormData.role} onChange={handleInputChange} />
      ) : (
        user.role
      ),
    status:
      editingUserId === user.id ? (
        <MDInput name="status" value={editFormData.status} onChange={handleInputChange} />
      ) : (
        user.status
      ),
    edit: user.id,
  }));

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
      <Footer />
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
// Compare this snippet from src/config/firebase_config.js:
