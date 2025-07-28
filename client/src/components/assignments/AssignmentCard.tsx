import { NavLink } from "react-router";
import { DateTime } from 'luxon';
import type { Assignment } from "../../library/types";

export default function AssignmentCard(assignment: Assignment) {
  const formattedDate = assignment.dueDate 
    ? DateTime.fromISO(assignment.dueDate).toLocaleString(DateTime.DATE_MED)
    : 'N/A';

  return (
    <NavLink to={`/courses/${assignment.origin}/${assignment.courseId}/${assignment.id}`}>
      <div className="rounded flex items-center gap-4 w-full p-4 hover:shadow-md bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
        <div className="flex justify-between items-start flex-1 text-gray-600">
          <p className="text-lg">{assignment.title}</p>
          <div className="text-right ">
            <p>Due: {formattedDate}</p>
          </div>
        </div>
      </div>  
    </NavLink>
  )

}

