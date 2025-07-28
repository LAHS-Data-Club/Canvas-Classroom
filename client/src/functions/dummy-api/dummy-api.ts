
import assignments from './dummy-data/assignments.json' with { type: "json" }
import planner from './dummy-data/planner.json' with { type: "json" }
import modules from './dummy-data/modules.json' with { type: "json" }

const PER_PAGE = 20;
const PER_PAGE_BULK = 100;
const COURSEID = '9029';

// server-side, make this a fetchAll function
export async function fetchModulesDummy(courseId: string) {
  console.log('%cfetching modules from ' + courseId, 'background: #2e3440; color: #88c0d0;');
  await simulateDelay(300);
  return modules;
}

// server-side, make this a fetchAll function
export async function fetchPlannerDummy() {
  console.log('%cfetching PLANNER DATA', 'background: #2e3440; color: #88c0d0;');
  await simulateDelay(300);
  return planner;
}

// TODO
async function fetchPage(page: number, perPage: number, delay: number) {
  await simulateDelay(delay);
  const pageAssignments = [];
  let i = perPage;
  while (i > 0) {
    const index = (page-1) * perPage + i;
    if (index < assignments.assignments.length) {
      pageAssignments.push(assignments.assignments[index]);
    }
    i--;
  }
  // create metadata:
  const hasNextPage = assignments.assignments.length > page * perPage;
  const nextPage = hasNextPage ? page + 1 : null;
  const hasPrevPage = page > 1;
  const prevPage = hasPrevPage ? page - 1 : null;
  return { assignments: pageAssignments, linkHeader: { prev: prevPage, curr: page, next: nextPage, } };
}

export async function fetchAssignmentPageDummy(page: number) {
  console.log('%cfetching page' + page, 'background: black; color: limegreen; font-weight: bold;');
  const data = await fetchPage(page, PER_PAGE, 1000);
  return data;
}

function simulateDelay(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

