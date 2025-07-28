import { DateTime } from 'luxon';
import type { Course, Module, Assignment, ModuleItem } from '../../library/types';


// TODO: all the dubious any types...
export function formatCanvasCourses(res: any): Course[] { 
  return res
    .filter((c) => c.access_restricted_by_date !== false)
    .map((item) => ({
    id: item.id.toString(),
    name: item.name, 
    url: null, // ?? can you not create a link yourself TODO: ??
    origin: 'canvas', 
  }));
}

export function formatCanvasModules(
  res: any, 
  courseId: string
): Module[] {
  return res.map((item) => ({
    id: item.id,
    courseId: courseId,
    name: item.name,
    itemsCount: item.item_count,
    origin: 'canvas',
  }));
}

// TODO: ugh
export function formatCanvasAssignments(res: any): Assignment[] {
  return res.filter((x) => x.due_at !== null)
    .map((item) => ({
      id: item.id.toString(),
      courseId: item.course_id.toString(), 
      moduleId: null, // TODO:
      url: item.html_url, 
      title: item.name,
      description: item.description, // TODO:
      materials: [],
      dueDate: DateTime.fromISO(item.due_at).toLocal().toISO(),
      points: item.points_possible || null,
      origin: 'canvas', 
    }));
}

export function formatCanvasModuleItems(res: any): ModuleItem[] {
  return res.map((item) => ({
    id: item.id,
    title: item.title,
    position: item.position, 
    type: item.type,
    contentId: item.content_id,
    link: item.external_url
  }));
}