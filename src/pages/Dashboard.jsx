import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, pointerWithin } from '@dnd-kit/core';
import { updateTaskStatus } from '../features/tasks/tasksSlice';
import Column from '../components/dashboard/Column';
import { LayoutDashboard } from 'lucide-react';

const COLUMNS = [
  { id: 'Need to Do', title: 'Need to Do', color: 'border-t-4 border-t-slate-300' },
  { id: 'In Progress', title: 'In Progress', color: 'border-t-4 border-t-blue-400' },
  { id: 'Need for Test', title: 'Need for Test', color: 'border-t-4 border-t-orange-400' },
  { id: 'Completed', title: 'Completed', color: 'border-t-4 border-t-green-400' },
  { id: 'Re-open', title: 'Re-open', color: 'border-t-4 border-t-red-400' },
];

function Dashboard() {
  const dispatch = useDispatch();
  const allTasks = useSelector(state => state.tasks.list);
  const projects = useSelector(state => state.projects.list);
  
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const filteredTasks = useMemo(() => {
    return selectedProjectId 
      ? allTasks.filter(t => t.projectId === selectedProjectId)
      : allTasks;
  }, [allTasks, selectedProjectId]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id; 

    const task = allTasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Track task progress across all your projects</p>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Filter by Project:</label>
          <select 
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-400 text-sm bg-white min-w-[200px]"
          >
            <option value="">All Projects</option>
            {projects.map(proj => (
              <option key={proj.id} value={proj.id}>{proj.title}</option>
            ))}
          </select>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-100 shadow-sm p-8">
          <LayoutDashboard size={48} className="text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-700">Get Started</h3>
          <p className="text-slate-500 text-center max-w-sm mt-1">
            You need to create a project and add tasks before you can view them on the board.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
          <div className="flex h-full gap-4 items-start min-w-max">
            <DndContext onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
              {COLUMNS.map(col => (
                <Column 
                  key={col.id} 
                  id={col.id} 
                  title={col.title} 
                  colorClass={col.color}
                  tasks={filteredTasks.filter(t => t.status === col.id)} 
                />
              ))}
            </DndContext>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
