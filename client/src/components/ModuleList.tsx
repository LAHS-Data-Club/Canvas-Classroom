// import ModuleCard from './modules/ModuleCard';
// import type { Module } from '../library/types';

// // TODO: 
// interface Props {
//   data: Module[];
//   isError: boolean;
//   isPending: boolean;
// }

// export default function ModuleList({ data, isError, isPending }: Props) {

//   // TODO: make less ugly
//   if (isError) return <div className="text-red-500">Error loading modules.</div>;
//   if (isPending) return <div className="text-gray-500">Loading modules...</div>;

//   return (
//     <div className="flex flex-col gap-2">
//       {data.map((module) => (
//         <ModuleCard key={module.id} module={module} />
//       ))}
//     </div>
//   );
// }

import ModuleCard from './modules/ModuleCard';
import type { Module } from '../library/types';

interface Props {
  data: Module[];
  isError: boolean;
  isPending: boolean;
}

export default function ModuleList({ data, isError, isPending }: Props) {

  // TODO: make less ugly
  if (isError) return <div className="text-red-500">Error loading modules.</div>;
  if (isPending) return <div className="text-gray-500">Loading modules...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Course Modules</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-slate-300 to-transparent"></div>
      </div>
      <div className="space-y-4">
        {data.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
    </div>
  );
}