import type { Course, Module, Assignment, ModuleItem } from "../../library/types";
import { formatCanvasCourses, formatCanvasModules, formatCanvasAssignments, formatCanvasModuleItems } from "./format";
import { xfetch, fetchAll } from "./fetch";


export async function getCanvasCourses(
  token: string
): Promise<Course[]> { 
  return await fetchAll(
    token,
    'courses',
    formatCanvasCourses,
    new URLSearchParams({ per_page: '50' }), // TODO: active
  );
}

export async function getCanvasModules(
  token: string,
  courseId: string,
): Promise<Module[]> {
  return await fetchAll( 
    token,
    `courses/${courseId}/modules`, 
    (res) => formatCanvasModules(res, courseId), 
    new URLSearchParams({ per_page: '50' }),
  );
}

export async function getCanvasAssignmentPage(
  token: string,
  courseId: string,
  page: string
): Promise<{ data: Assignment[], linkHeader: any }> {
  return await xfetch(
    token,
    `courses/${courseId}/assignments`,
    formatCanvasAssignments,
    new URLSearchParams({ per_page: '20', page, order_by: 'due_at' }),
  );
}

export async function getCanvasModulePage(
  token: string,
  courseId: string,
  moduleId: string,
  page: string
): Promise<{ data: ModuleItem[], linkHeader: any }> {
  return await xfetch(
    token,
    `courses/${courseId}/modules/${moduleId}/items`,
    formatCanvasModuleItems,
    new URLSearchParams({ per_page: '20', page }),
  );
}


