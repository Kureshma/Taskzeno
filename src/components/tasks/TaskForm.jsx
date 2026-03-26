import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../Input';
import Button from '../Button';
import FileInput from '../FileInput';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../../features/tasks/tasksSlice';
import { format } from 'date-fns';

const schema = yup.object().shape({
  title: yup.string().required('Task Title is required'),
  description: yup.string().required('Task Description is required'),
  assigneeId: yup.string().required('Assigning an employee is required'),
  eta: yup.date().required('ETA is required'),
  referenceImage: yup.string(),
});

function TaskForm({ initialData, projectId, projectEmployees, onClose }) {
  const dispatch = useDispatch();

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData ? {
      ...initialData,
      eta: format(new Date(initialData.eta), "yyyy-MM-dd"),
    } : { title: '', description: '', assigneeId: '', eta: '', referenceImage: '' }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        eta: format(new Date(initialData.eta), "yyyy-MM-dd"),
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    const taskData = {
      ...data,
      projectId,
      eta: new Date(data.eta).toISOString(),
    };

    if (initialData) {
      dispatch(updateTask({ ...taskData, id: initialData.id, status: initialData.status }));
    } else {
      dispatch(addTask(taskData));
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Task Title"
        placeholder="Enter the Task Title"
        {...register('title')}
        error={errors.title?.message}
      />
      
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-medium text-slate-700">Task Description</label>
        <textarea
          className={`px-3 py-2 border rounded-md outline-none bg-white min-h-[100px] resize-y
            focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200
            ${errors.description ? 'border-red-400 focus:ring-red-400' : 'border-slate-300'}`}
          placeholder="Detail task requirements..."
          {...register('description')}
        />
        {errors.description && <span className="text-xs text-red-500 mt-1">{errors.description.message}</span>}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-medium text-slate-700">Assign Employee</label>
        <select
          className={`px-3 py-2 border rounded-md outline-none bg-white 
            focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200
            ${errors.assigneeId ? 'border-red-400 focus:ring-red-400' : 'border-slate-300'}`}
          {...register('assigneeId')}
        >
          <option value="">-- Select an assigned employee --</option>
          {projectEmployees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name} ({emp.position})</option>
          ))}
        </select>
        {errors.assigneeId && <span className="text-xs text-red-500 mt-1">{errors.assigneeId.message}</span>}
      </div>
      
      <Input
        label="ETA (Estimated Time of Arrival)"
        type="date"
        {...register('eta')}
        error={errors.eta?.message}
      />

      <Controller
        name="referenceImage"
        control={control}
        render={({ field: { onChange, value } }) => (
          <FileInput
            label="Reference Image (Optional)"
            value={value}
            onChange={onChange}
            error={errors.referenceImage?.message}
          />
        )}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}

export default TaskForm;
