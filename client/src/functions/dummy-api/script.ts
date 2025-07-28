import fs from 'fs/promises';
import { DateTime } from 'luxon';

const BASE = 'mvla.instructure.com';
const PER_PAGE = 50;
const COURSE_ID = '9029';
const TOKEN = "10497~cFE2C9ENf88zmae2emPNPytZU9Fy76T8kyt27fPRWz6PLAYJTCn9AEMBJvf2WcP7";

// async function fetchAssignments(
//   token: string, 
//   courseId: string,
//   pageNum: number = 1,
//   perPage: number = 10,
// ) {
//   const url = `https://${BASE}/api/v1/courses/${courseId}/assignments?page=${pageNum}per_page=${perPage}&order_by=due_at`;
//   const data = await fetch(url, {
//     method: 'GET',
//     headers: {
//       Accept: "application/json", 
//       Authorization: `Bearer ${token}`
//     }
//   }).then((res) => {
//     if (!res.ok) {
//       throw new Error(`Canvas API error: ${res.status}`);
//     }
//     res.json().then((response) => response.map(formatAssignmentData))
//   });
//   return data;
// }

// // doesnt include assignments without due dates
// // todo: deal with assignments with no due dates later...
// async function fetchAllCanvasAssignments(
//   token: string,
//   courseId: string
// ) {
//   const assignments = [];
//   const pageInfo = {};
//   let url = `https://${BASE}/api/v1/courses/${courseId}/assignments?per_page=${PER_PAGE}&order_by=due_at`;
  
//   let pageNum = 1;
//   while (url) {
//     const res = await fetch(url, {
//       method: 'GET',
//       headers: {
//         Accept: "application/json", 
//         Authorization: `Bearer ${token}`
//       }
//     });
//     if (!res.ok) {
//       throw new Error(`Canvas API error: ${res.status}`);
//     }

//     const data = await res.json().then((response) => response.map(formatAssignmentData));
//     pageInfo[pageNum] = {
//       itemsCount: data.length,
//       startingDate: data[0].due_at,
//       endingDate: data[data.length-1].due_at
//     }
//     pageNum++;
//     assignments.push(...data);

//     const linkHeader = res.headers.get('Link');
//     const nextLink = linkHeader
//       ?.split(',')
//       .find(l => l.includes('rel="next"'))
//       ?.match(/<([^>]+)>/)?.[1];

//     url = nextLink || null;
//   }
//   return { pageInfo, assignments };
// }

async function fetchCanvasModules(courseId: string) {
  const modules = [];
  let url = `https://${BASE}/api/v1/courses/${courseId}/modules?per_page=500`; // can edit to be smaller
  while (url) {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: "application/json", 
        Authorization: `Bearer ${TOKEN}`
      }
    });
    if (!res.ok) {
      throw new Error(`Canvas API error: ${res.status}`);
    }

    const data = await res.json().then((response) => response.map(formatModuleData));
    modules.push(...data);

    const linkHeader = res.headers.get('Link');
    const nextLink = linkHeader
      ?.split(',')
      .find(l => l.includes('rel="next"'))
      ?.match(/<([^>]+)>/)?.[1];
    url = nextLink || null;
  }
  return { modules };
}


const modules = await fetchCanvasModules(COURSE_ID);
await saveDataToFile(modules, './dummy-data/modules.json');

// TODO
async function fetchCanvasModulesItems() {

};











// helper functions
async function saveDataToFile(data, filename) {
  const json = JSON.stringify(data, null, 2); 
  await fs.writeFile(filename, json, 'utf-8');
}

// /////// ////// format function
function formatAssignmentData(item) {
  const date = item.due_at ? // TODO: this seems silly
    DateTime.fromISO(item.due_at).toLocal().toISO() : 
    null;
  return {
    id: item.id.toString(),
    courseId: item.course_id.toString(), 
    url: item.html_url, 
    title: item.name,
    description: item.description || "", // TODO
    materials: [],
    dueDate: date,
    points: item.points_possible || null,
    originLMS: 'canvas', 
  }
}

function formatModuleData(item) {
  return {
    id: item.id.toString(),
    name: item.name,
    position: item.position, // pretty sure its the same anyways... so no need for this?
    items_count: item.items_count // this could be useful
  }
}