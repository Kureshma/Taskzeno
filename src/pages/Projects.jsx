import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProject, updateProject, deleteProject } from '../features/projects/projectsSlice';
import { deleteTasksByProjectId } from '../features/tasks/tasksSlice';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Card from '../components/Card';
import ProjectForm from '../components/projects/ProjectForm';
import { Plus, Users, Calendar, LayoutDashboard, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

function Projects() {
  const projects = useSelector((state) => state.projects.list);
  const employees = useSelector((state) => state.employees.list);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleOpenModal = (project = null) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProject(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (data) => {
    const projectData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    };

    if (editingProject) {
      dispatch(updateProject({ ...projectData, id: editingProject.id }));
    } else {
      dispatch(addProject(projectData));
    }
    handleCloseModal();
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project? All associated tasks will also be deleted.')) {
      dispatch(deleteProject(id));
      dispatch(deleteTasksByProjectId(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pr-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
          <p className="text-slate-500 text-sm mt-1">Manage workspaces and assign tasks</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={18} />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mb-4">
            <LayoutDashboard size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-700">No projects yet</h3>
          <p className="text-slate-500 text-center max-w-sm mt-1 mb-6">
            Create your first project to start organizing tasks and assignments.
          </p>
          <Button onClick={() => handleOpenModal()}>Create Project</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const assignedCount = proj.assignedEmployees?.length || 0;
            const avatars = proj.assignedEmployees
              ?.slice(0, 3)
              .map(id => employees.find(e => e.id === id))
              .filter(Boolean);

            return (
              <Card 
                key={proj.id} 
                className="group cursor-pointer hover:border-primary-300 hover:shadow-md transition-all flex flex-col"
              >
                <div onClick={() => navigate(`/projects/${proj.id}`)} className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <img 
                      src={proj.logo} 
                      alt={proj.title} 
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-50"
                      onError={(e) => { 
                        e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(proj.title) + '&background=random';
                      }}
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(proj); }}
                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded"
                        title="Edit Project"
                      >
                        <EditIcon />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, proj.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete Project"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">{proj.title}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{proj.description}</p>
                  
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-md">
                        <Calendar size={14} className="text-primary-500" />
                        {format(new Date(proj.endDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {avatars?.map((emp, i) => (
                            <img 
                              key={emp.id}
                              src={emp.profileImage}
                              alt={emp.name}
                              className="w-8 h-8 rounded-full border-2 border-white object-cover bg-slate-100"
                              title={emp.name}
                            />
                          ))}
                        </div>
                        {assignedCount > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600 -ml-2 z-10">
                            +{assignedCount - 3}
                          </div>
                        )}
                        {assignedCount === 0 && (
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Users size={14} /> No assignees
                          </span>
                        )}
                      </div>
                      <Button variant="ghost" className="text-primary-600 px-3 py-1 text-sm h-8">View Details</Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
      >
        <ProjectForm 
          initialData={editingProject} 
          onSubmit={handleSubmit} 
          onCancel={handleCloseModal} 
        />
      </Modal>
    </div>
  );
}


const EditIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;

export default Projects;
