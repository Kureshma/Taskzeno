import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  list: [],
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployee: (state, action) => {
      state.list.push({ id: uuidv4(), ...action.payload });
    },
    updateEmployee: (state, action) => {
      const index = state.list.findIndex((emp) => emp.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteEmployee: (state, action) => {
      state.list = state.list.filter((emp) => emp.id !== action.payload);
    },
  },
});

export const { addEmployee, updateEmployee, deleteEmployee } = employeesSlice.actions;
export default employeesSlice.reducer;
