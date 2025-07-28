import { useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useModuleItems } from "../../functions/queries/modules";
import { CourseworkContext } from "../../contexts/CourseworkContext";
import ModuleItem from "./ModuleItem";
import { Leapfrog } from 'ldrs/react'
import 'ldrs/react/Leapfrog.css'
import type { Module } from "../../library/types";

interface Props {
  module: Module
}

// also generated css by neil lmfao
export default function ModuleCard({ module }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { ref, inView } = useInView();
  const { assignmentQuery } = useContext(CourseworkContext); 

  const { // wtv it doesnt matter i just didnt want a giant vertical line bare with me
    allModuleItems, hasNextPage, isError, isLoading, fetchNextPage 
  } = useModuleItems(
    module.courseId, module.id, assignmentQuery, module.origin, expanded
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      console.log('fetching next page...');
      fetchNextPage();
    };
  }, [fetchNextPage, inView, allModuleItems, hasNextPage]);

  // TODO:
  if (isError) return <p>Error loading module items</p>;

  return (
    <div className="group bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
      <div 
        className="px-6 py-5 flex items-center justify-between cursor-pointer relative overflow-hidden hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="relative flex items-center gap-4 flex-1">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full group-hover:shadow-lg group-hover:shadow-blue-400/30 transition-all duration-300"></div>
          <h3 className="font-semibold text-lg text-slate-800 group-hover:text-slate-900 transition-colors">
            {module.name}
          </h3>
        </div>
        {/* Expand/collapse button */}
        <div className="relative">
          <div className={`w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-all duration-300 ${expanded ? 'rotate-180' : ''}`}>
            <svg 
              className="w-5 h-5 text-slate-600 transition-transform duration-300"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="space-y-3 bg-gradient-to-br from-slate-50/50 to-blue-50/30 border-t border-slate-200/50 p-6">
          {allModuleItems.map((module) => (
            <ModuleItem module={module}/>
          ))}

          {(hasNextPage || isLoading) && (
            <div ref={ref} className="flex justify-center p-3">
              <Leapfrog
                size="30"
                speed="2.5"
                color="gray" 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
