
import type { Course } from "../library/types";
import { NavLink } from "react-router";

interface Props {
  courses: Course[]
}

// neil had claude generate this lol 
export default function Sidebar({ courses }: Props) {
  return (
    <nav className="h-full w-72 flex-none bg-slate-900 text-white flex flex-col shadow-2xl fixed">
      
      <div className="flex flex-col justify-center p-8">
        <NavLink 
          to="/" 
          className="flex items-center gap-3 rounded-xl transition-all duration-300 group"
        >
          <h1 className="relative text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            lahs.-
          </h1>
        </NavLink>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mx-6 my-2"></div>
      
      <div className="flex flex-col overflow-auto p-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Your Courses</h2>
        <div className="space-y-2">
          {courses.map((course) => (
            <NavLink
              to={`/courses/${course.origin}/${course.id}`}
              key={course.id}
              className={({ isActive }) =>
                `group relative overflow-hidden rounded-xl p-4 block transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-blue-400/30 shadow-lg transform scale-[1.02]'
                    : 'hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 border border-transparent hover:border-white/10 hover:shadow-md hover:transform hover:scale-[1.01]'
                }`
              }
            >
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 transition-all duration-300 ${
                  course.origin === 'canvas' 
                    ? 'bg-orange-400 group-hover:bg-orange-300 group-hover:shadow-orange-400/50 group-hover:shadow-md' 
                    : 'bg-green-400 group-hover:bg-green-300 group-hover:shadow-green-400/50 group-hover:shadow-md'
                }`}></div>
                <h3 className="font-medium text-slate-200 group-hover:text-white transition-colors duration-300 leading-snug">
                  {course.name}
                </h3>
              </div>
            </NavLink>
          ))}
        </div>
      </div>

    </nav>
  );
}