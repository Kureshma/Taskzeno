import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addEmployee, updateEmployee, deleteEmployee } from '../features/employees/employeesSlice';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Card from '../components/Card';
import EmployeeForm from '../components/employees/EmployeeForm';
import { Plus, Edit2, Trash2, Mail, Briefcase } from 'lucide-react';

function Employees() {
  const employees = useSelector((state) => state.employees.list);
  const dispatch = useDispatch();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleOpenModal = (employee = null) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (data) => {
    if (editingEmployee) {
      dispatch(updateEmployee({ ...data, id: editingEmployee.id }));
    } else {
      dispatch(addEmployee(data));
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      dispatch(deleteEmployee(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pr-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Employees</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your team members</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={18} />
          Add Employee
        </Button>
      </div>

      {employees.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mb-4">
            <Plus size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-700">No employees yet</h3>
          <p className="text-slate-500 text-center max-w-sm mt-1 mb-6">
            Get started by adding your first team member to assign them to projects and tasks.
          </p>
          <Button onClick={() => handleOpenModal()}>Add Employee</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map((emp) => (
            <Card key={emp.id} className="p-5 flex flex-col items-center text-center group transition-all hover:shadow-md">
              <div className="relative mb-4">
                <img 
                  src={emp.profileImage} 
                  alt={emp.name} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
                  onError={(e) => { 
                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(emp.name) + '&background=random';
                  }}
                />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">{emp.name}</h3>
              <div className="flex items-center gap-1.5 text-primary-600 text-sm font-medium bg-primary-50 px-3 py-1 rounded-full mb-3">
                <Briefcase size={14} />
                {emp.position}
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-5 w-full justify-center">
                <Mail size={14} className="shrink-0" />
                <span className="truncate" title={emp.email}>{emp.email}</span>
              </div>
              
              <div className="mt-auto w-full grid grid-cols-2 gap-2 pt-4 border-t border-slate-50">
                <Button 
                  variant="ghost" 
                  onClick={() => handleOpenModal(emp)}
                  className="text-slate-600 hover:text-primary-600 flex justify-center items-center gap-2"
                >
                  <Edit2 size={16} /> Edit
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => handleDelete(emp.id)}
                  className="text-slate-600 hover:text-red-500 hover:bg-red-50 flex justify-center items-center gap-2 border-l border-slate-100 rounded-none rounded-r-md"
                >
                  <Trash2 size={16} /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
      >
        <EmployeeForm 
          initialData={editingEmployee} 
          onSubmit={handleSubmit} 
          onCancel={handleCloseModal} 
        />
      </Modal>
    </div>
  );
}

export default Employees;
