import { useDraggable } from '@dnd-kit/core';
import { format } from 'date-fns';
import { Clock, GripHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';

function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: task,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50,
  } : undefined;

  const employee = useSelector(state => state.employees.list.find(e => e.id === task.assigneeId));

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:border-primary-300 transition-colors group relative"
      {...attributes} 
      {...listeners}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 pr-4">{task.title}</h4>
        <div className="text-slate-300 group-hover:text-slate-500 absolute top-2 right-2">
          <GripHorizontal size={14} />
        </div>
      </div>
      
      {task.referenceImage && (
        <img 
          src={task.referenceImage} 
          alt="Reference" 
          className="w-full h-24 object-cover rounded-md mb-3 border border-slate-100"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
        {employee ? (
          <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
            <img 
              src={employee.profileImage} 
              alt={employee.name} 
              className="w-6 h-6 rounded-full object-cover shrink-0 bg-slate-100"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-xs font-medium text-slate-600 truncate">{employee.name}</span>
          </div>
        ) : (
          <div className="text-xs text-slate-400">Unassigned</div>
        )}
        
        <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded font-medium shrink-0 border border-slate-100">
          <Clock size={10} className={
            new Date(task.eta) < new Date() ? 'text-red-500' : 'text-orange-400'
          } />
          {format(new Date(task.eta), 'MMM d')}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
