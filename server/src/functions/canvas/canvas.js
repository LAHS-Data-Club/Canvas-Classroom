import { formatCanvasCourses, formatCanvasModules, formatCanvasAssignments, formatCanvasModuleItems } from "./format";
import { xfetch, fetchAll } from "./fetch";
export async function getCanvasCourses(token) {
    return await fetchAll(token, 'courses', formatCanvasCourses, new URLSearchParams({ per_page: '50' }));
}
export async function getCanvasModules(token, courseId) {
    return await fetchAll(token, `courses/${courseId}/modules`, (res) => formatCanvasModules(res, courseId), new URLSearchParams({ per_page: '50' }));
}
export async function getCanvasAssignmentPage(token, courseId, page) {
    return await xfetch(token, `courses/${courseId}/assignments`, formatCanvasAssignments, new URLSearchParams({ per_page: '20', page, order_by: 'due_at' }));
}
export async function getCanvasModulePage(token, courseId, moduleId, page) {
    return await xfetch(token, `courses/${courseId}/modules/${moduleId}/items`, formatCanvasModuleItems, new URLSearchParams({ per_page: '20', page }));
}
