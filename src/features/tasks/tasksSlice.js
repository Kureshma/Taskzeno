import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  list: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.list.push({ id: uuidv4(), status: 'Need to Do', ...action.payload });
    },
    updateTask: (state, action) => {
      const index = state.list.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.list = state.list.filter((task) => task.id !== action.payload);
    },
    updateTaskStatus: (state, action) => {
      const { id, status } = action.payload;
      const task = state.list.find((task) => task.id === id);
      if (task) {
        task.status = status;
      }
    },
    deleteTasksByProjectId: (state, action) => {
      state.list = state.list.filter((task) => task.projectId !== action.payload);
    }
  },
});

export const { addTask, updateTask, deleteTask, updateTaskStatus, deleteTasksByProjectId } = tasksSlice.actions;
export default tasksSlice.reducer;
