import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { database } from "config/firebase_config"; // Adjust the import path as necessary
import { ref, onValue, update } from "firebase/database"; // Adjust the import path as necessary
import axios from "axios";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import GOOGLE_MAPS_API_KEY from "apiKey";

const containerStyle = {
  width: "100%",
  height: "75vh",
  borderRadius: "8px",
};

const center = {
  lat: 3.124311,
  lng: 101.654963,
};

function LitterMap() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);
  const [litterData, setLitterData] = useState([
    { id: 1, latitude: 3.128, longitude: 101.652, litter: "Plastic bottles, wrappers" },
    { id: 2, latitude: 3.126, longitude: 101.648, litter: "Cans, bags" },
  ]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const tasksRef = ref(database, "tasks");
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const tasksList = [];
      for (let id in data) {
        tasksList.push({ id, ...data[id] });
      }
      setTasks(tasksList);
    });

    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const usersList = [];
      for (let id in data) {
        usersList.push({ id, ...data[id] });
      }
      setStaff(usersList);
    });
  }, []);

  const onLoad = React.useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback((map) => {
    setMap(null);
  }, []);

  const handleMarkerClick = (litter) => {
    setSelected(litter);
  };

  const handleInfoWindowClose = () => {
    setSelected(null);
  };

  const handleAssignStaffClick = () => {
    setShowModal(true);
  };

  // const handleCloseModal = () => setShowModal(false);

  // const handleStaffChange = (e) => {
  //   setSelectedStaff(e.target.value);
  // };

  const handleAssignStaff = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleStaffChange = (event) => {
    setSelectedStaff(event.target.value);
  };

  const handleSaveStaff = async () => {
    if (selected && selectedStaff) {
      const selectedUser = staff.find((user) => user.id === selectedStaff);
      if (selectedUser) {
        const taskRef = ref(database, `tasks/${selected.id}`);
        await update(taskRef, {
          assignedTo: {
            id: selectedUser.id, // Add the ID
            name: selectedUser.fullName || "Unknown", // Add the name
            email: selectedUser.email, // Add the email
          },
        });
  
        // Update the selected state for display
        setSelected({
          ...selected,
          assignedTo: {
            id: selectedUser.id,
            name: selectedUser.fullName || "Unknown",
            email: selectedUser.email,
          },
        });
  
        setShowModal(false);
  
        // Send email notification
        await axios.post("http://localhost:5000/send-email", {
          email: selectedUser.email,
          subject: "New Task Assigned",
          text: `You have been assigned a new task with ID: ${selected.task} at location: ${selected.location.latitude}, ${selected.location.longitude}`,
        });
      } else {
        console.error("Selected user not found.");
      }
    } else {
      alert("Please select a staff member to assign.");
    }
  };
  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={3} mb={3} px={3}>
        <Card sx={{ width: "100%", borderRadius: "8px" }}>
          <MDBox>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                {tasks.map((task) => (
                  <Marker
                    key={task.id}
                    position={{
                      lat: parseFloat(task.location.latitude),
                      lng: parseFloat(task.location.longitude),
                    }}
                    onClick={() => setSelected(task)}
                  />
                ))}

                {selected && (
                  <InfoWindow
                  position={{
                    lat: parseFloat(selected.location.latitude),
                    lng: parseFloat(selected.location.longitude),
                  }}
                  onCloseClick={handleInfoWindowClose}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "10px",
                      maxWidth: "250px",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 8px",
                        color: "#333",
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}
                    >
                      Task Details
                    </h3>
                    <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
                      <strong>Task ID:</strong> {selected.task}
                    </p>
                    <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
                      <strong>Status:</strong> {selected.status}
                    </p>
                    <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
                      <strong>Assigned To:</strong>{" "}
                      {selected.assignedTo?.email
                        ? `${selected.assignedTo.name} (${selected.assignedTo.email})`
                        : "Not Assigned"}
                    </p>
                    <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
                      <strong>Items:</strong>
                    </p>
                    <ul
                      style={{
                        listStyleType: "disc",
                        margin: "4px 0 8px 16px",
                        padding: 0,
                        fontSize: "14px",
                        color: "#555",
                      }}
                    >
                      {Object.entries(selected.items).map(([item, count]) => (
                        <li key={item}>
                          {item}: {count}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={handleAssignStaff}
                      style={{
                        backgroundColor: "#007bff",
                        color: "#fff",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      Assign Staff
                    </button>
                  </div>
                </InfoWindow>
                
                
                
                )}
              </GoogleMap>
            ) : (
              <Typography>Loading map...</Typography>
            )}
          </MDBox>
        </Card>
      </MDBox>

      <Modal open={showModal} onClose={handleCloseModal} 
      sx={{
        // display: "flex",
        // alignItems: "center",
        // justifyContent: "center",
        backdropFilter: "blur(5px)", // Optional: Adds a blur effect to the background
      }}>
        <MDBox
          p={4}
          sx={{
            bgcolor: "#fff", // Set background color to white
            borderRadius: "8px", // Add rounded corners
            width: "300px",
            mx: "auto",
            mt: "10%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 24, // Add shadow for depth
          }}
        >
          <MDTypography variant="h6" component="h2" gutterBottom>
            Assign Staff
          </MDTypography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Select value={selectedStaff} onChange={handleStaffChange}>
              {staff.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <MDBox mt={2} display="flex" justifyContent="space-between" width="100%">
            <MDButton variant="contained" color="primary" onClick={handleSaveStaff}>
              Save
            </MDButton>
            <MDButton variant="contained" color="secondary" onClick={handleCloseModal}>
              Cancel
            </MDButton>
          </MDBox>
        </MDBox>
      </Modal>
    </DashboardLayout>
  );
}
export default LitterMap;
