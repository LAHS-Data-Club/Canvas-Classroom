import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import AssignmentCard from "./assignments/AssignmentCard";
import { Leapfrog } from 'ldrs/react'
import 'ldrs/react/Leapfrog.css'
import type { AssignmentQuery } from "../library/types";
import { groupAssignments } from "../functions/util";

export default function AssignmentsList({ 
  allAssignments, 
  fetchNextPage, 
  hasNextPage,
  isFetchingNextPage, 
}: AssignmentQuery) {

  const { ref, inView } = useInView(); 
  useEffect(() => {
    if (inView && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, isFetchingNextPage, inView]);

  if (!allAssignments) {
    return <div className="text-gray-500">Loading assignments...</div>;
  }

  const { past, upcoming } = groupAssignments(allAssignments);

  return (
    <div className="space-y-12">
      {upcoming.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-800">Upcoming Assignments</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-slate-300 to-transparent"></div>
          </div>
          <div className="grid gap-4">
            {upcoming.map((assignment) => (
              <AssignmentCard key={assignment.id} {...assignment} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-800">Past Assignments</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-slate-300 to-transparent"></div>
          </div>
          <div className="grid gap-4">
            {past.map((assignment) => (
              <AssignmentCard key={assignment.id} {...assignment} />
            ))}
          </div>
        </section>
      )}

      {(hasNextPage || isFetchingNextPage) && (
        <div ref={ref} className="flex justify-center p-3">
          <Leapfrog
            size="30"
            speed="2.5"
            color="gray" 
          />
        </div>
      )}
    </div>
  );
}