import { getCanvasCourses, getCanvasModules, getCanvasAssignmentPage } from "./canvas/canvas.js";
import { getClassroomCourses, getClassroomModules, getClassroomAssignmentPage } from "./classroom/classroom.js";
export async function getCourses(canvasToken, classroomToken) {
    return (await Promise.all([
        canvasToken ? getCanvasCourses(canvasToken) : Promise.resolve([]),
        classroomToken ? getClassroomCourses(classroomToken) : Promise.resolve([]),
    ])).flat();
}
export async function getCourseModules(canvasToken, classroomToken, courseId, origin) {
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
export async function getCourseAssignment(canvasToken, classroomToken, courseId, page, // either number for canvas, or nextToken for classroom
origin) {
    switch (origin) {
        case 'classroom':
            return getClassroomAssignmentPage(classroomToken, courseId, page);
        case 'canvas':
            return getCanvasAssignmentPage(canvasToken, courseId, page);
        default:
            throw new Error(`Invalid origin ${origin}`);
    }
}
