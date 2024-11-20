import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";

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

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import GOOGLE_MAPS_API_KEY from "apiKey";

const containerStyle = {
  width: "100%",
  height: "75vh",
  borderRadius: "8px",
};

const center = {
  lat: 3.127534,
  lng: 101.650496,
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
  const [staff, setStaff] = useState([{ id: 1, name: "John Doe" }, { id: 2, name: "Jane Smith" }]);
  const [selectedStaff, setSelectedStaff] = useState("");

  const onLoad = React.useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
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

  const handleCloseModal = () => setShowModal(false);

  const handleStaffChange = (e) => {
    setSelectedStaff(e.target.value);
  };

  const handleAssign = () => {
    if (selected) {
      console.log(`Assigned ${selectedStaff} to location ${selected.latitude}, ${selected.longitude}`);
      setSelected({ ...selected, assigned_staff: selectedStaff });
      handleCloseModal();
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
                zoom={17}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                {litterData.map((litter) => (
                  <Marker
                    key={litter.id}
                    position={{ lat: litter.latitude, lng: litter.longitude }}
                    onClick={() => handleMarkerClick(litter)}
                  />
                ))}
                {selected && (
                  <InfoWindow
                    position={{ lat: selected.latitude, lng: selected.longitude }}
                    onCloseClick={handleInfoWindowClose}
                  >
                    <Box>
                      <Typography variant="h6">Details</Typography>
                      <Typography variant="body2">
                        {selected.litter.split(",").map((item, index) => (
                          <p key={index}>{item.trim()}</p>
                        ))}
                      </Typography>
                      <Button variant="contained" color="primary" onClick={handleAssignStaffClick}>
                        Assign Staff
                      </Button>
                    </Box>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : (
              <Typography>Loading map...</Typography>
            )}
          </MDBox>
        </Card>
      </MDBox>
      {/* <Footer /> */}

      <Modal open={showModal} onClose={handleCloseModal}>
        <Box sx={{ p: 4, backgroundColor: "white", borderRadius: "8px", maxWidth: "500px", mx: "auto", my: "20vh" }}>
          <Typography variant="h6" gutterBottom>
            Assign Staff
          </Typography>
          <FormControl fullWidth>
            <Select value={selectedStaff} onChange={handleStaffChange} displayEmpty>
              <MenuItem value="" disabled>Select a staff member</MenuItem>
              {staff.map((member) => (
                <MenuItem key={member.id} value={member.name}>
                  {member.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleAssign} disabled={!selectedStaff}>
              Assign
            </Button>
            <Button variant="text" onClick={handleCloseModal} sx={{ ml: 2 }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default LitterMap;
