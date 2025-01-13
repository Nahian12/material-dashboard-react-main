import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import LitterMap from "layouts/litterMap";
import TasksList from "layouts/tasksList";
import MyTasks from "layouts/myTasks";
import Logout from "layouts/authentication/logout";
import Leaderboard from "layouts/leaderboard";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    authRequired: true,
  },
  {
    type: "collapse",
    name: "Staff List",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
    authRequired: true,
  },
  {
    type: "collapse",
    name: "Litter Map",
    key: "litter-map",
    icon: <Icon fontSize="small">map</Icon>,
    route: "/litter-map",
    component: <LitterMap />,
    authRequired: true,
  },
  {
    type: "collapse",
    name: "Tasks List",
    key: "tasks-list",
    icon: <Icon fontSize="small">list</Icon>,
    route: "/tasks-list",
    component: <TasksList />,
    authRequired: true,
  },
  {
    type: "collapse",
    name: "My Tasks",
    key: "my-tasks",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/my-tasks",
    component: <MyTasks />,
    authRequired: true,
  },
  {
    type: "collapse",
    name: "Leaderboard",
    key: "leaderboard",
    icon: <Icon fontSize="small">leaderboard</Icon>,
    route: "/leaderboard",
    component: <Leaderboard />,
    authRequired: true,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    authRequired: true,
  },
  {
    type: "collapse",
    name: "Logout",
    key: "logout",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/authentication/logout",
    component: <Logout />,
  },
];

// Auth routes not in navbar
const authRoutes = [
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
    authRequired: false,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
    authRequired: false,
  },
];

export { routes, authRoutes };