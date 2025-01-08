import React, { useState, useEffect } from "react";
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import { database } from "config/firebase_config";
import { ref, onValue } from "firebase/database";

function Dashboard() {
  const chartData = reportsBarChartData();
  const lineData = reportsLineChartData();
  const { sales, tasks } = reportsLineChartData;
  const [tasksCompletedToday, setTasksCompletedToday] = useState(0);
  const [tasksCompletedYesterday, setTasksCompletedYesterday] = useState(0);
  const [tasksCompletedThisWeek, setTasksCompletedThisWeek] = useState(0);
  const [tasksCompletedLastWeek, setTasksCompletedLastWeek] = useState(0);
  const [uncollectedLitter, setUncollectedLitter] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);

  useEffect(() => {
    const statisticsRef = ref(database, "Statistics/Tasks Completed Today");
    onValue(statisticsRef, (snapshot) => {
      const data = snapshot.val();
      setTasksCompletedToday(data || 0);
    });

    const yesterdayRef = ref(database, "Statistics/Tasks Completed Yesterday");
    onValue(yesterdayRef, (snapshot) => {
      const data = snapshot.val();
      setTasksCompletedYesterday(data || 0);
    });

    const weekRef = ref(database, "Statistics/Tasks Completed This Week");
    onValue(weekRef, (snapshot) => {
      const data = snapshot.val();
      setTasksCompletedThisWeek(data || 0);
    });

    const lastWeekRef = ref(database, "Statistics/Tasks Completed Last Week");
    onValue(lastWeekRef, (snapshot) => {
      const data = snapshot.val();
      setTasksCompletedLastWeek(data || 0);
    });

    const litterRef = ref(database, "Statistics/Uncollected Litter");
    onValue(litterRef, (snapshot) => {
      const data = snapshot.val();
      setUncollectedLitter(data || 0);
    });

    const pendingRef = ref(database, "Statistics/Pending Tasks");
    onValue(pendingRef, (snapshot) => {
      const data = snapshot.val();
      setPendingTasks(data || 0);
    });
  }, []);

  const calculatePercentageDifference = (current, previous) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return Math.round(((current - previous) / previous) * 100);
  };

  const percentageDifference = calculatePercentageDifference(
    tasksCompletedToday,
    tasksCompletedYesterday
  );
  const percentageColor = percentageDifference >= 0 ? "success" : "error";
  const percentageSign = percentageDifference >= 0 ? "+" : "";

  const percentageDifferenceWeek = calculatePercentageDifference(
    tasksCompletedThisWeek,
    tasksCompletedLastWeek
  );
  const percentageColorWeek = percentageDifferenceWeek >= 0 ? "success" : "error";
  const percentageSignWeek = percentageDifferenceWeek >= 0 ? "+" : "";

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Tasks Completed Today"
                count={tasksCompletedToday}
                percentage={{
                  color: percentageColor,
                  amount: `${percentageSign}${percentageDifference.toFixed(0)}%`,
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Tasks Completed This Week"
                count={tasksCompletedThisWeek}
                percentage={{
                  color: percentageColorWeek,
                  amount: `${percentageSignWeek}${percentageDifferenceWeek.toFixed(0)}%`,
                  label: "than last week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Uncollected Litter"
                count={uncollectedLitter}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Current total uncollected litter",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Pending Tasks"
                count={pendingTasks}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Current total pending tasks",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Daily Task Completion"
                  description="Task Completion Graph"
                  date="Updated just now"
                  chart={chartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Monthly Completed Tasks"
                  // description={
                  //   <>
                  //     (<strong>+15%</strong>) increase in today sales.
                  //   </>
                  // }
                  description="Completed Tasks Comparison"
                  date="Updated just now"
                  chart={lineData.sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Monthly Total Uncollected Litter"
                  description="Uncollected Litter Comparison"
                  date="Updated just now"
                  chart={lineData.tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        {/* <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
