import { formatClassroomCourses, formatClassroomModules, formatClassroomAssignments } from './format';
import { fetchAll, xfetch } from './fetch';
// TODO: note this breaks if u own a class soooo fix that later
export async function getClassroomCourses(token) {
    return await fetchAll(token, 'courses', formatClassroomCourses);
}
export async function getClassroomModules(token, courseId) {
    return await fetchAll(token, 'courses.topics', (res) => formatClassroomModules(res, courseId), { courseId });
}
2;
export async function getClassroomAssignmentPage(token, courseId, pageToken) {
    return await xfetch(token, 'courses.courseWork', formatClassroomAssignments, { courseId, pageToken, pageSize: 50 } // experiment with different page sizes
    );
}
// export async function getAssignmentSubmission(
//   token: string, 
//   courseId: string, 
//   assignmentId: string
// ): Promise<Submission> {
//   oauth2Client.setCredentials({ refresh_token: token });
//   const response = await classroom.courses.courseWork.studentSubmissions.list({
//     courseId: courseId,
//     courseWorkId: assignmentId,
//     auth: oauth2Client,
//   });
//   const data = response.data.studentSubmissions; // TODO:
//   const attachments = data[0].assignmentSubmission?.attachments?.map((item) => ({
//     type: Object.keys(item)[0],
//     ...Object.values(item)[0]
//   })) || [];
//   const formattedData = {
//     id: data[0].id!,
//     submitted: data[0].state === 'TURNED_IN',
//     attachments: attachments
//   }
//   return formattedData;
// }
