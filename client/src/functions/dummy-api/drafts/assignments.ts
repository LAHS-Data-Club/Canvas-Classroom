// import { useInfiniteQuery, useIsRestoring, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { assignmentOptions, plannerOptions } from "../queryOptions/options";
// import { removeDuplicateIds } from "../functions/helper";
// import { fetchAssignmentPage } from "../functions/api";


// // TODO: when query inactive?
// // ALSO TODO: fix the refetchonmount thing to funciton like the modules do
// // so either rel=last hook or multiple fetches forward hook
// // fetching forward hook
// /**
//  * ALL this reall does is 
//  * 1.) fetches prev consecutively (maybe make on demand)
//  * 2.) fetches new (skip)
//  * 3.) TODO: sort assignments into different categories //
//  */ 
// // TODO: just use inf query?


// export function useAssignments(courseId: string, enabled: boolean) {
//   const queryClient = useQueryClient();
//   const isRestoring = useIsRestoring();
//   // for all realistic purposes: rel=last will suffice
//   const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());
//   const [isFetchingNextPage, setIsFetchingNextPage] = useState(true);
//   const [startingPage, setStartingPage] = useState<number>();

//   // TODO: prefetch this on first load 
//   const plannerQuery = useQuery(plannerOptions());

//   async function updateNewAssignments(startingPage: number) {
//     let nextPage = startingPage + 1;
//     let moreToFetch = true;
//     while (moreToFetch) {
//       const queries = await Promise.all(([0, 1, 2].map((i) => ( // hardcoded 3 calls
//         queryClient.fetchQuery(assignmentOptions(courseId, nextPage + i))
//       ))));
//       const newPages = [];
//       for (const [index, query] of queries.entries()) {
//         console.log(index)
//         const page = nextPage + index;
//         if (query.assignments.length) {
//           newPages.push(page);
//         } else {  
//           // TODO: also remember to change this when query changes
//           queryClient.removeQueries({ queryKey: ['assignments', courseId, page], exact: true });
//           moreToFetch = false;
//         }
//       }
//       setLoadedPages((prev) => new Set([...prev, ...newPages].sort((a, b) => b - a)));
//       nextPage += 3;
//     }
//   }

//   // TODO: fix each time you change the key format
//   // currently: ['assignments', courseId, page#]
//   // TODO: bad things happen because htis runs twice // todo
//   useEffect(() => {
//     if (!isRestoring) {
//       const cached = queryClient.getQueryCache().findAll();
//       const match = cached.map((query) => query.queryKey) // could crash lol
//         .filter((key) => key.includes(courseId) && key.includes('assignments')) 
//         .map((key) => key[2]); 
//       const startingPage = match.length ? Math.max(...match) : 1;

//       // why does this run twice???
//       console.log('STARTING APGE: ' + startingPage); // this logs weirldy

//       setLoadedPages(new Set([startingPage]));
//       setStartingPage(startingPage);
//       updateNewAssignments(startingPage);
//     }
//   }, [isRestoring]);

//   // console.log(loadedPages);
//   const assignmentQueries = useQueries({
//     queries: [...loadedPages].map((page) => ({
//       ...assignmentOptions(courseId, page),
//       initialData: () => queryClient.getQueryData(['assignments', page]),
//       refetchOnMount: true,
//       enabled: startingPage && page <= startingPage,
//     }))
//   });

//   useEffect(() => { 
//     if (assignmentQueries && assignmentQueries.length) { 
//       const lastQuery = assignmentQueries[assignmentQueries.length-1];
//       if (!lastQuery.isPending) {
//         setIsFetchingNextPage(false);
//       } 
//     }
//   }, [assignmentQueries]); 

//   // TODO: fix some of the weird behavior
//   // TODO: these run at the same time why? this is not the intended behavior but i like it 
//   const fetchNextPage = useCallback(() => {
//     // TODO: TODO: TODO: why does this make all fetch at once
//     if (isFetchingNextPage || !loadedPages) return;

//     const nextPage = Math.min(...loadedPages) - 1;
//     if (nextPage >= 1) {
//       setIsFetchingNextPage(true);
//       setLoadedPages((prev) => new Set([...prev, nextPage].sort((a, b) => b - a)));
//       console.log('%cfetching pg' + nextPage, 'background: #2e3440; color: #88c0d0;')
//     }
//     console.log(loadedPages) // weird loaded pages issue there are really cooked things happening right now
//     ////
//   }, [isFetchingNextPage, loadedPages]);
 
//   const allAssignments = combineAssignments(plannerQuery, assignmentQueries);

//   return { // TODO: has next page, loading, is error, etc.
//     assignmentQueries, 
//     allAssignments, 
//     fetchNextPage, 
//     isFetchingNextPage,
//   }
// }

// function combineAssignments(plannerQuery, assignmentQueries) {
//   // const plannerAssignments = plannerQuery.isSuccess
//   //   ? plannerQuery.data.planner
//   //   : [];
//   const plannerAssignments = [];
//   const allAssignments = assignmentQueries
//     // .flatMap((query) => query.isSuccess ? query.data.assignment : [])
//     .map((q) => q.data)
//     .filter((q) => q)
//     .flatMap((q) => q.assignments);

//   const seenIds = []; // remove duplicate assignments
//   const combinedAssignments = [...plannerAssignments, ...allAssignments]
//     .filter((assignment) => {
//       if (!seenIds.includes(assignment.id)) {
//         seenIds.push(assignment.id);
//         return true;
//       }
//       return false;
//     });

//   return combinedAssignments;
// }