import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../Input';
import Button from '../Button';
import FileInput from '../FileInput';
import { useSelector } from 'react-redux';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  position: yup.string().required('Position is required'),
  email: yup.string().email('Invalid email').required('Official Email ID is required'),
  profileImage: yup.string().required('Profile Image is required'),
});

function EmployeeForm({ initialData, onSubmit, onCancel }) {
  const employees = useSelector((state) => state.employees.list);
  
  const { register, handleSubmit, control, formState: { errors }, setError, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || { name: '', position: '', email: '', profileImage: '' }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    const emailExists = employees.some(
      (emp) => emp.email.toLowerCase() === data.email.toLowerCase() && emp.id !== initialData?.id
    );

    if (emailExists) {
      setError('email', { type: 'manual', message: 'Email must be unique' });
      return;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="Enter your Name"
        {...register('name')}
        error={errors.name?.message}
      />
      
      <Input
        label="Position"
        placeholder="Enter your position"
        {...register('position')}
        error={errors.position?.message}
      />
      
      <Input
        label="Official Email ID"
        type="email"
        placeholder="Enter your e-mail id"
        {...register('email')}
        error={errors.email?.message}
      />
      
      <Controller
        name="profileImage"
        control={control}
        render={({ field: { onChange, value } }) => (
          <FileInput
            label="Profile Image"
            value={value}
            onChange={onChange}
            error={errors.profileImage?.message}
          />
        )}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Employee' : 'Add Employee'}
        </Button>
      </div>
    </form>
  );
}

export default EmployeeForm;
