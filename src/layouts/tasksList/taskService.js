// taskService.js
import { database } from "config/firebase_config";
import { ref, push, set, update, remove } from "firebase/database";

export const addTask = (task) => {
  const taskRef = push(ref(database, "tasks"));
  set(taskRef, task);
};

export const updateTask = (taskId, updatedTask) => {
  const taskRef = ref(database, `tasks/${taskId}`);
  update(taskRef, updatedTask);
};

export const deleteTask = (taskId) => {
  const taskRef = ref(database, `tasks/${taskId}`);
  remove(taskRef);
};
