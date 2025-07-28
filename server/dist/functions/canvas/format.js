import { DateTime } from 'luxon';
// TODO: all the dubious any types... ignore the any spam um idk what to do unless i literally copy paste all the canvas types
// which i might do ig...
// TODO: just getting it to shut up for now
export function formatCanvasCourses(res) {
    return res
        .filter((c) => c.access_restricted_by_date !== false)
        .map((item) => ({
        id: item.id.toString(),
        name: item.name,
        url: null, // ?? can you not create a link yourself TODO: ??
        origin: 'canvas',
    }));
}
export function formatCanvasModules(res, courseId) {
    return res.map((item) => ({
        id: item.id,
        courseId: courseId,
        name: item.name,
        itemsCount: item.item_count,
        origin: 'canvas',
    }));
}
// TODO: ugh
export function formatCanvasAssignments(res) {
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
export function formatCanvasModuleItems(res) {
    return res.map((item) => ({
        id: item.id,
        title: item.title,
        position: item.position,
        type: item.type,
        contentId: item.content_id,
        link: item.external_url
    }));
}
