import { DateTime } from 'luxon';
import type { Course, Module, Assignment, ModuleItem } from '../../library/types';


export function formatClassroomCourses(res: any): Course[] { 
  return res.courses.map((item) => ({
    id: item.id,
    name: item.name,
    url: item.alternateLink,
    origin: 'classroom', 
  }));
}

export function formatClassroomModules(
  res: any, 
  courseId: string
): Module[] {
  return res.topic?.map((item) => ({
    id: item.topicId!,
    courseId: courseId,
    name: item.name,
    itemsCount: undefined,
    origin: 'classroom',
  })) || [];
}

export function formatClassroomAssignments(
  res: any
): Assignment[] {
  return res.courseWork.map((item) => {
    const materials = item.materials?.map(formatMaterials);
    const keys = {...item.dueDate, ...item.dueTime};
    const date = item.dueDate ?  // TODO: this seems silly
      DateTime.utc(...Object.values(keys)).toLocal().toISO() :
      null;
    return ({
      id: item.id, 
      courseId: item.courseId,
      moduleId: item.topicId,
      title: item.title,
      description: item.description,
      dueDate: date,
      materials: materials || [],
      points: item.maxPoints || null,
      url: item.alternateLink,
      origin: 'classroom',
    });
  });
}

function formatMaterials(item) {
  const type = Object.keys(item)[0];
  const attachments = (type === 'driveFile') ?
    item.driveFile?.driveFile :
    Object.values(item)[0];
  return ({
    type: type,
    ...attachments
  });
}

// // TODO: ugh
// export function formatCanvasAssignments(res: any): Assignment[] {
//   return res.filter((x) => x.due_at !== null)
//     .map((item) => ({
//       id: item.id.toString(),
//       courseId: item.course_id.toString(), 
//       url: item.html_url, 
//       title: item.name,
//       description: item.description || "", // TODO
//       materials: [],
//       dueDate: DateTime.fromISO(item.due_at).toLocal().toISO(),
//       points: item.points_possible || null,
//       originLMS: 'canvas', 
//     }));
// }

// export function formatCanvasModuleItems(res: any): ModuleItem[] {
//   return res.map((item) => ({
//     id: item.id,
//     title: item.title,
//     position: item.position, 
//     type: item.type,
//     contentId: item.content_id,
//     link: item.external_url
//   }));
// }