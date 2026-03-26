import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../Input';
import Button from '../Button';
import FileInput from '../FileInput';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

const schema = yup.object().shape({
  title: yup.string().required('Project Title is required'),
  description: yup.string().required('Project Description is required'),
  logo: yup.string().required('Project Logo is required'),
  startDate: yup.date().required('Start Date is required'),
  endDate: yup.date()
    .min(yup.ref('startDate'), "End date can't be before Start date")
    .required('End Date is required'),
  assignedEmployees: yup.array().min(1, 'Select at least one employee').of(yup.string()),
});

function ProjectForm({ initialData, onSubmit, onCancel }) {
  const allEmployees = useSelector((state) => state.employees.list);
  
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData ? {
      ...initialData,
      startDate: format(new Date(initialData.startDate), "yyyy-MM-dd'T'HH:mm"),
      endDate: format(new Date(initialData.endDate), "yyyy-MM-dd'T'HH:mm"),
    } : { title: '', description: '', logo: '', startDate: '', endDate: '', assignedEmployees: [] }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        startDate: format(new Date(initialData.startDate), "yyyy-MM-dd'T'HH:mm"),
        endDate: format(new Date(initialData.endDate), "yyyy-MM-dd'T'HH:mm"),
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Project Title"
        placeholder="Enter the project title"
        {...register('title')}
        error={errors.title?.message}
      />
      
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-medium text-slate-700">Project Description</label>
        <textarea
          className={`px-3 py-2 border rounded-md outline-none bg-white min-h-[100px] resize-y
            focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200
            ${errors.description ? 'border-red-400 focus:ring-red-400' : 'border-slate-300'}`}
          placeholder="Describe the project..."
          {...register('description')}
        />
        {errors.description && <span className="text-xs text-red-500 mt-1">{errors.description.message}</span>}
      </div>

      <Controller
        name="logo"
        control={control}
        render={({ field: { onChange, value } }) => (
          <FileInput
            label="Project Logo"
            value={value}
            onChange={onChange}
            error={errors.logo?.message}
          />
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date & Time"
          type="datetime-local"
          {...register('startDate')}
          error={errors.startDate?.message}
        />
        <Input
          label="End Date & Time"
          type="datetime-local"
          {...register('endDate')}
          error={errors.endDate?.message}
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-medium text-slate-700 mb-1">Assign Employees</label>
        {allEmployees.length === 0 ? (
          <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
            No employees available. Please add employees first.
          </p>
        ) : (
          <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-md p-2 space-y-2 bg-slate-50">
            <Controller
              name="assignedEmployees"
              control={control}
              render={({ field }) => (
                <>
                  {allEmployees.map(emp => (
                    <label key={emp.id} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer border border-transparent hover:border-slate-100 shadow-sm transition-all h-14">
                      <input
                        type="checkbox"
                        value={emp.id}
                        checked={field.value?.includes(emp.id)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...(field.value || []), emp.id]
                            : field.value?.filter(v => v !== emp.id);
                          field.onChange(updated);
                        }}
                        className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                      />
                      <img src={emp.profileImage} alt="" className="w-8 h-8 rounded-full object-cover" 
                        onError={e => { e.target.style.display = 'none'; }} />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{emp.name}</span>
                        <span className="text-xs text-slate-500">{emp.position}</span>
                      </div>
                    </label>
                  ))}
                </>
              )}
            />
          </div>
        )}
        {errors.assignedEmployees && <span className="text-xs text-red-500 mt-1">{errors.assignedEmployees.message}</span>}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}

export default ProjectForm;
