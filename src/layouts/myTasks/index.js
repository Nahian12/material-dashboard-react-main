import React, { useState, useEffect } from "react";
import { database } from "config/firebase_config"; // Adjust the import path as necessary
import { ref, onValue, update } from "firebase/database"; // Adjust the import path as necessary

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";
import Slider from "@mui/material/Slider";


function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);

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
  }, []);

  const handleCommentChange = (taskId, value) => {
    setComments({ ...comments, [taskId]: value });
    setEditingTaskId(taskId);
  };

  const handleSaveComment = async (taskId) => {
    const taskRef = ref(database, `tasks/${taskId}`);
    await update(taskRef, { comment: comments[taskId] });
    setEditingTaskId(null);
  };

//   const handleStatusChange = async (taskId, newStatus) => {
//     const taskRef = ref(database, `tasks/${taskId}`);
//     await update(taskRef, { status: newStatus });
//     setTasks((prevTasks) =>
//       prevTasks.map((task) =>
//         task.id === taskId ? { ...task, status: newStatus } : task
//       )
//     );
//   };
    const handleSliderChange = async (taskId, newValue) => {
        const taskRef = ref(database, `tasks/${taskId}`);
        await update(taskRef, { completion: newValue });
        setTasks((prevTasks) =>
        prevTasks.map((task) =>
            task.id === taskId ? { ...task, completion: newValue } : task
        )
        );
    };

  const columns = [
    { Header: "Task ID", accessor: "task", align: "left", width: "10%" },
    { Header: "Created", accessor: "created", align: "left" },
    { Header: "Location", accessor: "location", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Comment", accessor: "comment", align: "center" },
    { Header: "Action", accessor: "action", align: "center", width: "25%" },
  ];

  const rows = tasks.map((task) => ({
    task: task.task,
    created: task.created,
    location: `${task.location.latitude}, ${task.location.longitude}`,
    status: task.completion === 0 ? "Not Started" : task.completion === 100 ? "Completed" : `${task.completion}%`,
    comment: (
      <MDBox display="flex" alignItems="center">
        <TextField
          value={comments[task.id] || task.comment || ""}
          onChange={(e) => handleCommentChange(task.id, e.target.value)}
          variant="outlined"
          size="small"
        />
        {editingTaskId === task.id && (
          <IconButton onClick={() => handleSaveComment(task.id)}>
            <SaveIcon />
          </IconButton>
        )}
      </MDBox>
    ),
    action: (
        <MDBox width="100%">
        <Slider
          value={task.completion || 0}
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
                  boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)',
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
                <MDTypography variant="h6" color="white">
                  My Tasks
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

export default MyTasks;