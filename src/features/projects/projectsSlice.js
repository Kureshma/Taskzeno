import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  list: [],
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action) => {
      state.list.push({ id: uuidv4(), ...action.payload });
    },
    updateProject: (state, action) => {
      const index = state.list.findIndex((proj) => proj.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteProject: (state, action) => {
      state.list = state.list.filter((proj) => proj.id !== action.payload);
    },
  },
});

export const { addProject, updateProject, deleteProject } = projectsSlice.actions;
export default projectsSlice.reducer;
