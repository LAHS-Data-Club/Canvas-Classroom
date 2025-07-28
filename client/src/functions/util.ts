import type { Assignment } from "../library/types"
import { DateTime } from 'luxon';

interface SortedAssignments {
  past: Assignment[],
  upcoming: Assignment[],
  notDue: Assignment[],
}

export function groupAssignments(
  assignments: Assignment[]
) { 
  const now = DateTime.now();
  const sortedAssignments: SortedAssignments = { past: [], upcoming: [], notDue: [] };
  assignments.forEach(assignment => {
    if (!assignment.dueDate) {
      sortedAssignments.notDue.push(assignment);
    } else {
      const dueDate = DateTime.fromISO(assignment.dueDate);
      if (dueDate > now) {
        sortedAssignments.upcoming.push(assignment);
      } else {
        sortedAssignments.past.push(assignment);
      }
    }
  });
  return sortedAssignments;
}