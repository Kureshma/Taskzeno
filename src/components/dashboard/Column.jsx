import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

function Column({ id, title, tasks, colorClass }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div className="flex flex-col flex-1 min-w-[280px] max-w-[320px] bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100 h-full">
      <div className={`p-3 border-b border-slate-100 flex items-center justify-between bg-white ${colorClass}`}>
        <h3 className="font-bold text-slate-700 text-sm">{title}</h3>
        <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div 
        ref={setNodeRef} 
        className={`flex-1 p-3 space-y-3 overflow-y-auto min-h-[150px] transition-colors ${isOver ? 'bg-primary-50/50' : ''}`}
      >
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default Column;
