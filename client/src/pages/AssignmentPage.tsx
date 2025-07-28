import { useAssignments } from "../functions/queries/assignments";
import { useParams } from "react-router";

export default function AssignmentPage() {
  // TODO: looks wonky...
  const { origin, courseId, assignmentId } = useParams() as { origin: string, courseId: string, assignmentId: string };

  // first search if assignment exists in the cache
  const assignmentQuery = useAssignments(courseId, origin); // TODO: deal with refetching states
  if (!assignmentQuery.allAssignments) return null;

  const assignment = assignmentQuery.allAssignments.find(a => a.id === assignmentId);
  if (!assignment) {
    console.error(`Assignment with ID ${assignmentId} not found in course ${courseId}.`);
    // try to fetch it directly 
    return <p>Unable to find assignment</p>
  } 

  // TODO: sanitize the html
  return (
    <div className="text-black bg-white p-10 rounded-lg ">
      <h1 className="text-3xl font-bold mb-2">{assignment?.title || 'Assignment Not Found'}</h1>
      <a 
        href={assignment.url}
        target='_blank'
        className='hover:text-indigo-500 hover:underline text-indigo-400'
      >
        Open in {assignment.origin}
      </a>
      <p className="mb-2">Due: {assignment.dueDate || 'N/A'}</p>
      <div dangerouslySetInnerHTML={{ __html: assignment?.description }} />
    </div>
  );
}