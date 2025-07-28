
import type { Course, Module, AssignmentGroup, ModuleItem } from "../library/types";


// TODO: test with planner later ...
export async function fetchPlanner() {
  return [];
}

export async function fetchCourses(): Promise<Course[]> {
  console.log('fetching courses');
  return fetch(`/api/courses`).then(res => res.json());
}

export async function fetchModules(
  courseId: string,
  origin: string
): Promise<Module[]> {
  return fetch(`/api/courses/${courseId}/modules?origin=${origin}`)
    .then(res => res.json());
}

export async function fetchAssignmentPage(
  courseId: string, 
  origin: string,
  page: number | string
): Promise<AssignmentGroup> {
  return fetch(`/api/courses/${courseId}/assignments?page=${page}&origin=${origin}`)
    .then(res => res.json());
}

// TODO: incorrect typing Promise<ModuleItem[]>
export async function fetchModulePage(
  courseId: string, 
  moduleId: string, 
  page: number
) {
  return fetch(`/api/courses/${courseId}/modules/${moduleId}/items?page=${page}`)
    .then(res => res.json());
}





