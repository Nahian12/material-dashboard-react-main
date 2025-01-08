import { useState, useEffect } from "react";
import { database } from "config/firebase_config";
import { ref, onValue } from "firebase/database";

const useLineChartData = () => {
  const [UncollectedLitterDecember, setUncollectedLitterDecember] = useState(0);
  const [UncollectedLitterNovember, setUncollectedLitterNovember] = useState(0);
  const [UncollectedLitterOctober, setUncollectedLitterOctober] = useState(0);
  const [UncollectedLitterJanuary, setUncollectedLitterJanuary] = useState(0);
  const [CompletedTasksOctober, setCompletedTasksOctober] = useState(0);
  const [CompletedTasksNovember, setCompletedTasksNovember] = useState(0);
  const [CompletedTasksDecember, setCompletedTasksDecember] = useState(0);
  const [CompletedTasksJanuary, setCompletedTasksJanuary] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const totalKeys = 8;

    const updateLoadedCount = () => {
      loadedCount++;
      if (loadedCount === totalKeys) {
        setIsDataLoaded(true);
      }
    };

    const uncollectedLitterDecember = ref(database, "Statistics/Uncollected Litter December");
    onValue(uncollectedLitterDecember, (snapshot) => {
      setUncollectedLitterDecember(snapshot.val() || 0);
      updateLoadedCount();
    });

    const uncollectedLitterNovember = ref(database, "Statistics/Uncollected Litter November");
    onValue(uncollectedLitterNovember, (snapshot) => {
      setUncollectedLitterNovember(snapshot.val() || 0);
      updateLoadedCount();
    });

    const uncollectedLitterOctober = ref(database, "Statistics/Uncollected Litter October");
    onValue(uncollectedLitterOctober, (snapshot) => {
      setUncollectedLitterOctober(snapshot.val() || 0);
      updateLoadedCount();
    });

    const uncollectedLitterJanuary = ref(database, "Statistics/Uncollected litter January");
    onValue(uncollectedLitterJanuary, (snapshot) => {
      setUncollectedLitterJanuary(snapshot.val() || 0);
      updateLoadedCount();
    });

    const completedTasksOctober = ref(database, "Statistics/Completed Tasks October");
    onValue(completedTasksOctober, (snapshot) => {
      setCompletedTasksOctober(snapshot.val() || 0);
      updateLoadedCount();
    });

    const completedTasksNovember = ref(database, "Statistics/Completed Tasks November");
    onValue(completedTasksNovember, (snapshot) => {
      setCompletedTasksNovember(snapshot.val() || 0);
      updateLoadedCount();
    });

    const completedTasksDecember = ref(database, "Statistics/Completed Tasks December");
    onValue(completedTasksDecember, (snapshot) => {
      setCompletedTasksDecember(snapshot.val() || 0);
      updateLoadedCount();
    });

    const completedTasksJanuary = ref(database, "Statistics/Completed Tasks January");
    onValue(completedTasksJanuary, (snapshot) => {
      setCompletedTasksJanuary(snapshot.val() || 0);
      updateLoadedCount();
    });
  }, []);

  return {
    data: [
      UncollectedLitterDecember,
      UncollectedLitterNovember,
      UncollectedLitterOctober,
      UncollectedLitterJanuary,
      CompletedTasksOctober,
      CompletedTasksNovember,
      CompletedTasksDecember,
      CompletedTasksJanuary,
    ],
    isDataLoaded,
  };
};

const ReportsLineChartData = () => {
  const { data, isDataLoaded } = useLineChartData();

  useEffect(() => {
    if (isDataLoaded) {
      console.log(data);
    }
  }, [isDataLoaded, data]);

  return {
    sales: {
      labels: ["Oct", "Nov", "Dec", "Jan"],
      datasets: {
        label: "Completed Tasks",
        data: [
          data[4], // CompletedTasksOctober
          data[5], // CompletedTasksNovember
          data[6], // CompletedTasksDecember
          data[7], // CompletedTasksJanuary
        ],
      },
    },
    tasks: {
      labels: ["Oct", "Nov", "Dec", "Jan"],
      datasets: {
        label: "Uncollected Litter",
        data: [
          data[2], // UncollectedLitterOctober
          data[1], // UncollectedLitterNovember
          data[0], // UncollectedLitterDecember
          data[3], // UncollectedLitterJanuary
        ],
      },
    },
  };
};

export default ReportsLineChartData;
