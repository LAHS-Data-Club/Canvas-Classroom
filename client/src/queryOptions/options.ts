import { queryOptions } from '@tanstack/react-query'
import { 
  fetchAssignmentPage, 
  fetchCourses, 
  fetchPlanner, 
  fetchModules,
} from '../functions/api';

export function coursesOptions() {
  return queryOptions({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });
}

export function plannerOptions() {
  return queryOptions({
    queryKey: ['planner'],
    queryFn: fetchPlanner
  });
}

export function assignmentOptions(
  courseId: string, 
  origin: string,
  page: number, 
) {
  return queryOptions({
    queryKey: ['assignments', courseId, page],
    queryFn: async () => {
      console.log('fetching page:', page);
      return await fetchAssignmentPage(courseId, origin, page);
    },
  });
}

export function moduleOptions(
  courseId: string, 
  origin: string
) {
  return queryOptions({
    queryKey: ['modules', courseId],
    queryFn: () => fetchModules(courseId, origin),
  });
}