import type { Course, Module, Assignment, ModuleItem } from "../library/types";
import { getCanvasCourses, getCanvasModules, getCanvasAssignmentPage } from "./canvas/canvas";
import { getClassroomCourses, getClassroomModules, getClassroomAssignmentPage } from "./classroom/classroom";

export async function getCourses(
  canvasToken: string, 
  classroomToken: string
): Promise<Course[]> {
  return (await Promise.all([ // TODO: consider requiring both tokens to be present 
    canvasToken ? getCanvasCourses(canvasToken): Promise.resolve([]), 
    classroomToken ? getClassroomCourses(classroomToken): Promise.resolve([]),
  ])).flat();
}

export async function getCourseModules(
  canvasToken: string, 
  classroomToken: string,
  courseId: string,
  origin: string
): Promise<Module[]> {
  switch (origin) {
    case 'classroom':
      return getClassroomModules(classroomToken, courseId);
    case 'canvas':
      return getCanvasModules(canvasToken, courseId);
    default:
      throw new Error(`Invalid origin ${origin}`);
  }
}

// TODO:
export async function getCourseAssignment(
  canvasToken: string, 
  classroomToken: string,
  courseId: string,
  page: string, // either number for canvas, or nextToken for classroom
  origin: string
): Promise<{ data: Assignment[], linkHeader: any }> {
  switch (origin) {
    case 'classroom':
      return getClassroomAssignmentPage(classroomToken, courseId, page);
    case 'canvas':
      return getCanvasAssignmentPage(canvasToken, courseId, page);
    default:
      throw new Error(`Invalid origin ${origin}`);
  }
}