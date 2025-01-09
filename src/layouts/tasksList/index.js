import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import DataTable from "examples/Tables/DataTable";
import PropTypes from "prop-types";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import MDProgress from "components/MDProgress";
import Slider from "@mui/material/Slider";

import { addTask, updateTask, deleteTask } from "./taskService";
import { database } from "config/firebase_config";
import { ref, onValue, update } from "firebase/database";

function TasksList() {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const taskRef = ref(database, "tasks");
    onValue(taskRef, (snapshot) => {
      const tasks = snapshot.val();
      const taskList = [];
      for (let id in tasks) {
        taskList.push({ id, ...tasks[id] });
      }
      setTasks(taskList);
    });
  }, []);

  const handleAddTask = () => {
    const task = {
      task: "",
      created: new Date().toLocaleString(),
      assignedTo: { name: "", email: "" },
      location: { latitude: "0.0000", longitude: "0.0000" },
      status: "",
      items: {},
    };
    setEditFormData(task);
    setIsAddingNew(true);
  };

  const handleSliderChange = (taskId, newValue) => {
    setEditFormData({ ...editFormData, completion: newValue });
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTask(task);
  };

  const handleSaveTask = async () => {
    if (isAddingNew) {
      const newTask = {
        ...editFormData,
        items: {
          plasticCups: 2,
          plasticBag: 1,
          plasticBottle: 1,
          ...editFormData.items,
        },
      };
      await addTask(newTask);
    } else {
      const taskRef = ref(database, `tasks/${editingTaskId}`);
      await update(taskRef, editFormData);
    }
    setIsAddingNew(false);
    setEditingTaskId(null);
    setEditFormData({});
  };

  const handleCancelClick = () => {
    setEditingTaskId(null);
    setEditingTask({});
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (isAddingNew) {
      if (name.includes("assignedTo")) {
        const field = name.split(".")[1];
        setEditFormData((prevFormData) => ({
          ...prevFormData,
          assignedTo: {
            ...prevFormData.assignedTo,
            [field]: value,
          },
        }));
      } else if (name.includes("location")) {
        const field = name.split(".")[1];
        setEditFormData((prevFormData) => ({
          ...prevFormData,
          location: {
            ...prevFormData.location,
            [field]: value,
          },
        }));
      } else {
        setEditFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      }
    } else {
      if (name.includes("assignedTo")) {
        const field = name.split(".")[1];
        setEditingTask((prevTask) => ({
          ...prevTask,
          assignedTo: {
            ...prevTask.assignedTo,
            [field]: value,
          },
        }));
      } else if (name.includes("location")) {
        const field = name.split(".")[1];
        setEditingTask((prevTask) => ({
          ...prevTask,
          location: {
            ...prevTask.location,
            [field]: value,
          },
        }));
      } else {
        setEditingTask((prevTask) => ({
          ...prevTask,
          [name]: value,
        }));
      }
    }
  };
  

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
        <MDTypography display="block" variant="caption">
          {latitude},
        </MDTypography>
        <MDTypography variant="caption">{longitude}</MDTypography>
      </MDBox>
    </MDBox>
  );

  Coordinate.propTypes = {
    latitude: PropTypes.string.isRequired,
    longitude: PropTypes.string.isRequired,
  };

  Author.propTypes = {
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };

  const columns = [
    { Header: "Task ID", accessor: "task", align: "left" },
    { Header: "Created", accessor: "created", align: "left" },
    { Header: "Assigned To", accessor: "assignedTo", align: "center" },
    { Header: "Location", accessor: "location", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = [
    ...(isAddingNew
      ? [
          {
            task:<MDInput name="task" value={editFormData.task} onChange={handleChange} />,
            created: <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                      {editFormData.created}
                    </MDTypography>,
            assignedTo: <>
            <MDInput
              name="assignedTo.name"
              value={editFormData.assignedTo?.name || ""}
              onChange={handleChange}
              sx={{ mr: 1 }} 
            />
            <MDInput
              name="assignedTo.email"
              value={editFormData.assignedTo?.email || ""}
              onChange={handleChange}
            />
          </>,
            location: <>
            <MDInput
              name="location.latitude"
              value={editFormData.location?.latitude || ""}
              onChange={handleChange}
              sx={{ mr: 1 }}
            />
            <MDInput
              name="location.longitude"
              value={editFormData.location?.longitude || ""}
              onChange={handleChange}
            />
          </>,
            status:(
              <MDBox width="100%">
                <Slider
                  value={editFormData.completion || 0}
                  onChange={(e, newValue) => handleSliderChange(null, newValue)}
                  step={25}
                  marks={[
                    { value: 0, label: "0%" },
                    { value: 25, label: "25%" },
                    { value: 50, label: "50%" },
                    { value: 75, label: "75%" },
                    { value: 100, label: "100%" },
                  ]}
                  min={0}
                  max={100}
                  valueLabelDisplay="auto"
                  sx={{
                    minWidth: 200,
                    color: '#007bff',
                    height: 5,
                    padding: '15px 0',
                    '& .MuiSlider-track': {
                      border: 'none',
                      height: 4, // Increase the height of the track
                    },
                    '& .MuiSlider-rail': {
                      height: 4, // Increase the height of the rail
                    },
                    '& .MuiSlider-thumb': {
                      height: 20,
                      width: 20,
                      backgroundColor: '#fff',
                      boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
                      '&:focus, &:hover, &.Mui-active': {
                        boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
                        '@media (hover: none)': {
                          boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
                        },
                      },
                      '&:before': {
                        boxShadow:
                          '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
                      },
                    },
                    '& .MuiSlider-valueLabel': {
                      fontSize: 12,
                      fontWeight: 'normal',
                      top: -6,
                      backgroundColor: 'unset',
                      color: '#000',
                      '&::before': {
                        display: 'none',
                      },
                      '& *': {
                        background: 'transparent',
                        color: '#000',
                      },
                    },
                  }}
                />
              </MDBox>
            ),
            action: (
              <MDButton variant="contained" color="primary" onClick={handleSaveTask}>
                Save
              </MDButton>
            ),
            action:
            <>
            
              <div>
                <MDButton onClick={handleSaveTask} color="success">
                  Save
                </MDButton>
                <MDButton onClick={handleCancelClick} color="warning">
                  Cancel
                </MDButton>
              </div>
             
            </>
          },
        ]
      : []),
    ...tasks.map((task) => ({
    task:
      editingTaskId === task.id ? (
        <MDInput name="task" value={editingTask.task} onChange={handleChange} />
      ) : (
        task.task
      ),
    created: (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {task.created}
      </MDTypography>
    ),
    assignedTo:
      editingTaskId === task.id ? (
        <>
          <MDInput
            name="assignedTo.name"
            value={editingTask.assignedTo?.name || ""}
            onChange={handleChange}
            sx={{ mr: 1 }}
          />
          <MDInput
            name="assignedTo.email"
            value={editingTask.assignedTo?.email || ""}
            onChange={handleChange}
          />
        </>
      ) : (
        <Author name={task.assignedTo.name} email={task.assignedTo.email} />
      ),
    location:
      editingTaskId === task.id ? (
        <>
          <MDInput
            name="location.latitude"
            value={editingTask.location?.latitude || ""}
            onChange={handleChange}
            sx={{ mr: 1 }}
          />
          <MDInput
            name="location.longitude"
            value={editingTask.location?.longitude || ""}
            onChange={handleChange}
          />
        </>
      ) : (
        <Coordinate latitude={task.location.latitude} longitude={task.location.longitude} />
      ),
      status:
      editingTaskId === task.id ? (
        <MDBox width="100%">
          <Slider
            value={editFormData.completion !== undefined ? editFormData.completion : editingTask.completion || 0}
            onChange={(e, newValue) => handleSliderChange(task.id, newValue)}
            step={25}
            marks={[
              { value: 0, label: "0%" },
              { value: 25, label: "25%" },
              { value: 50, label: "50%" },
              { value: 75, label: "75%" },
              { value: 100, label: "100%" },
            ]}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            sx={{
              minWidth: 200,
              color: '#007bff',
              height: 5,
              padding: '15px 0',
              '& .MuiSlider-track': {
                border: 'none',
                height: 4, // Increase the height of the track
              },
              '& .MuiSlider-rail': {
                height: 4, // Increase the height of the rail
              },
              '& .MuiSlider-thumb': {
                height: 20,
                width: 20,
                backgroundColor: '#fff',
                boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
                '&:focus, &:hover, &.Mui-active': {
                  boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
                  '@media (hover: none)': {
                    boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
                  },
                },
                '&:before': {
                  boxShadow:
                    '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
                },
              },
              '& .MuiSlider-valueLabel': {
                fontSize: 12,
                fontWeight: 'normal',
                top: -6,
                backgroundColor: 'unset',
                color: '#000',
                '&::before': {
                  display: 'none',
                },
                '& *': {
                  background: 'transparent',
                  color: '#000',
                },
              },
            }}
          />
        </MDBox>
      ) : (
        <MDBox width="8rem" textAlign="left">
          <MDProgress
            value={task.completion || 0}
            color={task.completion === 100 ? "success" : "info"}
            variant="gradient"
            label={false}
          />
        </MDBox>
      ),
    action:
      isAddingNew && task.id === "" ? (
        <div>
          <MDButton onClick={handleSaveTask} color="success">
            Save
          </MDButton>
          <MDButton onClick={handleCancelClick} color="warning">
            Cancel
          </MDButton>
          <MDButton onClick={() => handleDeleteTask(task.id)} color="error">
            Delete
          </MDButton>
        </div>
      ) :
      editingTaskId === task.id ? (
        <>
          <MDButton onClick={handleSaveTask} color="success">
            Save
          </MDButton>
          <MDButton onClick={handleCancelClick} color="warning">
            Cancel
          </MDButton>
          <MDButton onClick={() => handleDeleteTask(task.id)} color="error">
            Delete
          </MDButton>
        </>
      ) : (
        <Button onClick={() => handleEditTask(task)}>Edit</Button>
      ),
  }))
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