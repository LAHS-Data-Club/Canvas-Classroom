import { useParams } from "react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { coursesOptions, moduleOptions } from "../queryOptions/options";
import { useAssignments } from "../functions/queries/assignments"; 
import { CourseworkContext } from "../contexts/CourseworkContext";

import ModuleList from "../components/ModuleList";
import AssignmentsList from "../components/AssignmentList";

// TODO: think about isresoring
export default function ClassPage() {
  const { origin, courseId } = useParams() as { origin: string, courseId: string };
  const [activeTab, setActiveTab] = useState<'assignments' | 'modules'>('assignments'); 
  const coursesQuery = useQuery(coursesOptions());

  // TODO: ??? maybe? context to make sure its only mounted once 
  const assignmentQuery = useAssignments(courseId, origin);
  const moduleQuery = useQuery(moduleOptions(courseId, origin));

  if (coursesQuery.isLoading) return <p>Loading...</p>;
  const targetCourse = coursesQuery.data?.find((c) => c.id === courseId);
  if (!targetCourse) throw new Error("Invalid course id.");

  return (
    <CourseworkContext.Provider value={{ assignmentQuery }}>
      <div className="flex flex-col min-h-screen">
        <div className="p-9 shadow-neutral-200 shadow-sm sticky">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            {targetCourse.name}
          </h1>
          <div className="gap-2 p-1 bg-slate-100/60 rounded-2xl border border-slate-200 flex w-fit">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-6 py-3 rounded-xl font-semibold relative overflow-hidden cursor-pointer ${
                activeTab === 'assignments'
                  ? 'bg-white text-slate-800'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <span>Assignments</span>
              {activeTab === 'assignments' && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`px-6 py-3 rounded-xl font-semibold relative overflow-hidden cursor-pointer ${
                activeTab === 'modules'
                  ? 'bg-white text-slate-800'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <span>Modules</span>
              {activeTab === 'modules' && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl"></div>
              )}
            </button>
          </div>
        </div>

        <main className="flex-1 px-10 py-8 max-w-7xl mx-auto w-full">
          {activeTab === 'assignments' ? (
            <AssignmentsList {...assignmentQuery} />
          ) : (
            <ModuleList {...moduleQuery} />
          )}
        </main>
      </div>
    </CourseworkContext.Provider>
  );
}

