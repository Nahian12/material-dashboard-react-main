import { useState, useEffect } from "react";
import { database } from "config/firebase_config";
import { ref, onValue } from "firebase/database";

const useReportsBarChartData = () => {
  const [tasksCompletedMonday, setTasksCompletedMonday] = useState(0);
  const [tasksCompletedTuesday, setTasksCompletedTuesday] = useState(0);
  const [tasksCompletedWednesday, setTasksCompletedWednesday] = useState(0);
  const [tasksCompletedThursday, setTasksCompletedThursday] = useState(0);
  const [tasksCompletedFriday, setTasksCompletedFriday] = useState(0);
  const [tasksCompletedSaturday, setTasksCompletedSaturday] = useState(0);
  const [tasksCompletedSunday, setTasksCompletedSunday] = useState(0);

  useEffect(() => {
    const mondayRef = ref(database, "Statistics/Tasks Completed Monday");
    onValue(mondayRef, (snapshot) => {
      setTasksCompletedMonday(snapshot.val() || 0);
    });

    const tuesdayRef = ref(database, "Statistics/Tasks Completed Tuesday");
    onValue(tuesdayRef, (snapshot) => {
      setTasksCompletedTuesday(snapshot.val() || 0);
    });

    const wednesdayRef = ref(database, "Statistics/Tasks Completed Wednesday");
    onValue(wednesdayRef, (snapshot) => {
      setTasksCompletedWednesday(snapshot.val() || 0);
    });

    const thursdayRef = ref(database, "Statistics/Tasks Completed Thursday");
    onValue(thursdayRef, (snapshot) => {
      setTasksCompletedThursday(snapshot.val() || 0);
    });

    const fridayRef = ref(database, "Statistics/Tasks Completed Friday");
    onValue(fridayRef, (snapshot) => {
      setTasksCompletedFriday(snapshot.val() || 0);
    });

    const saturdayRef = ref(database, "Statistics/Tasks Completed Saturday");
    onValue(saturdayRef, (snapshot) => {
      setTasksCompletedSaturday(snapshot.val() || 0);
    });

    const sundayRef = ref(database, "Statistics/Tasks Completed Sunday");
    onValue(sundayRef, (snapshot) => {
      setTasksCompletedSunday(snapshot.val() || 0);
    });
  }, []);

  return [
    tasksCompletedMonday,
    tasksCompletedTuesday,
    tasksCompletedWednesday,
    tasksCompletedThursday,
    tasksCompletedFriday,
    tasksCompletedSaturday,
    tasksCompletedSunday,
  ];
};

const ReportsBarChartData = () => {
  const data = useReportsBarChartData();

  return {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: {
      label: "Tasks Completed",
      data: data,
    },
  };
};

export default ReportsBarChartData;
