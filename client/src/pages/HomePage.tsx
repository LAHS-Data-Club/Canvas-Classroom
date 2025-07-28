import { useQuery } from "@tanstack/react-query";
import { coursesOptions } from "../queryOptions/options";
import { NavLink } from "react-router";

export default function HomePage() {
  const courses = useQuery(coursesOptions()); 
  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-800 mb-8 pb-3 border-b-2 border-slate-200">
        Your Courses
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {courses.data?.map(course => (
          <NavLink to={`/courses/${course.origin}/${course.id}`} key={course.id}>
            <div 
              key={course.id}
              className="rounded-md bg-gray-100 border-1 border-neutral-200 shadow-md p-6 m-2 w-64 h-64 flex flex-col hover:bg-gray-200 transition cursor-pointer"
            >
              <div className="bg-slate-800 rounded-md w-full h-full"></div>
              <p className="text-neutral-700 mt-4 font-semibold line-clamp-1">{course.name}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}