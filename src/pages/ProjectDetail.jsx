import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTask } from '../features/tasks/tasksSlice';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { ArrowLeft, Plus, Calendar, Clock, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import TaskForm from '../components/tasks/TaskForm';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const project = useSelector((state) => state.projects.list.find((p) => p.id === id));
  const employees = useSelector((state) => state.employees.list);
  const tasks = useSelector((state) => state.tasks.list.filter((t) => t.projectId === id));

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <h2 className="text-xl font-bold text-slate-800">Project Not Found</h2>
        <Button onClick={() => navigate('/projects')} className="mt-4">Back to Projects</Button>
      </div>
    );
  }

  const projectEmployees = project.assignedEmployees
    ?.map(empId => employees.find(e => e.id === empId))
    .filter(Boolean) || [];

  const handleOpenTaskModal = (task = null) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(false);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Delete this task?')) {
      dispatch(deleteTask(taskId));
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <button 
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back to Projects
      </button>

      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start">
        <img 
          src={project.logo} 
          alt={project.title} 
          className="w-24 h-24 rounded-xl object-cover border border-slate-200 bg-slate-50"
          onError={(e) => { 
            e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(project.title) + '&background=random';
          }}
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{project.title}</h1>
          <p className="text-slate-600 mb-6">{project.description}</p>
          
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <Calendar size={16} className="text-primary-500" />
              <span className="font-medium">Start:</span>
              {format(new Date(project.startDate), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <Clock size={16} className="text-orange-500" />
              <span className="font-medium">End:</span>
              {format(new Date(project.endDate), 'MMM d, yyyy')}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Project Tasks</h2>
            <Button onClick={() => handleOpenTaskModal()} className="flex items-center gap-2">
              <Plus size={16} /> Add Task
            </Button>
          </div>

          {tasks.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 p-8 text-center shadow-sm">
              <p className="text-slate-500 mb-4">No tasks added to this project yet.</p>
              <Button onClick={() => handleOpenTaskModal()} variant="secondary">Create First Task</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => {
                const assignee = employees.find(e => e.id === task.assigneeId);
                return (
                  <Card key={task.id} className="p-4 flex flex-col sm:flex-row gap-4 justify-between group hover:border-primary-200 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full
                          ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}
                        >
                          {task.status}
                        </span>
                        <h3 className="font-bold text-slate-800">{task.title}</h3>
                      </div>
                      <p className="text-slate-500 text-sm mb-3 line-clamp-2">{task.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                        {assignee && (
                          <div className="flex items-center gap-1.5">
                            <img src={assignee.profileImage} alt="" className="w-5 h-5 rounded-full object-cover" />
                            {assignee.name}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-orange-400" />
                          ETA: {format(new Date(task.eta), 'MMM d')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex sm:flex-col gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4 justify-center">
                      <button 
                        onClick={() => handleOpenTaskModal(task)} 
                        className="text-slate-400 hover:text-primary-600 transition-colors p-1"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id)} 
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Assigned Team</h2>
          <Card className="p-4 bg-white">
            {projectEmployees.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No employees assigned</p>
            ) : (
              <div className="space-y-3">
                {projectEmployees.map(emp => (
                  <div key={emp.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <img 
                      src={emp.profileImage} 
                      alt={emp.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{emp.name}</p>
                      <p className="text-xs text-slate-500">{emp.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <Modal isOpen={isTaskModalOpen} onClose={handleCloseTaskModal} title={editingTask ? 'Edit Task' : 'Create Task'}>
        <TaskForm 
          initialData={editingTask} 
          projectId={project.id} 
          projectEmployees={projectEmployees} 
          onClose={handleCloseTaskModal} 
        />
      </Modal>
    </div>
  );
}

export default ProjectDetail;
