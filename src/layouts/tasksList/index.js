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
import { addTask, updateTask, deleteTask } from "./taskService";
import { database } from "config/firebase_config";
import { ref, onValue } from "firebase/database";

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
    };
    setEditFormData(task);
    setIsAddingNew(true);
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTask(task);
  };

  const handleSaveTask = () => {
    if (isAddingNew) {
      addTask(editFormData);
      setIsAddingNew(false); 
      setEditFormData({}); 
    } else if (editingTaskId) {
      updateTask(editingTaskId, editingTask); 
      setEditingTaskId(null);
      setEditingTask({}); 
    }
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
            status:<MDInput name="status" value={editFormData.status} onChange={handleChange} />,
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
        <MDInput name="status" value={editingTask.status} onChange={handleChange} />
      ): (
        task.status
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