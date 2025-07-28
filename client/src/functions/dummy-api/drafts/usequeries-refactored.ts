import { useIsRestoring, useQueries, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { assignmentOptions } from "../../../queryOptions/options";
import { enumerate } from "../../helper";


// TODO: combine with planner assignments
// TODO: maybe try smth with enabled

export function useAssignments(courseId: string, origin: string) {
  const queryClient = useQueryClient();
  const isRestoring = useIsRestoring();
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  
  const assignmentQueries = useQueries({
    queries: [...loadedPages].map((page) => assignmentOptions(courseId, origin, page))
  });

  const fetchNewAssignments = useCallback(async (startingPage: number, concurrentCalls = 3) => {
    let moreToFetch = true;
    while (moreToFetch) {
      const newPages = enumerate(concurrentCalls).map(i => startingPage + i);
      const queries = await Promise.all(newPages.map((page) => (
        queryClient.fetchQuery(assignmentOptions(courseId, origin, page))
      )));

      const pagesToAdd: number[] = [];
      for (const [index, query] of queries.entries()) {
        if (query.data.length) { 
          pagesToAdd.push(newPages[index]);
        } else {  
          moreToFetch = false;
        }
      }
      setLoadedPages((prev) => new Set([...prev, ...pagesToAdd].sort((a, b) => b - a)));
      startingPage += concurrentCalls;
    }
  }, [courseId, origin, queryClient]);

  // set initial page from cache
  useEffect(() => {
    if (!isRestoring) {
      const cached = queryClient.getQueryCache().findAll();
      const keys = cached
        .filter((query) => query.queryKey[0] === 'assignments' && query.queryKey[1] === courseId)
        .filter((query) => { // remove empty queries
          const keep = query.state.data?.data.length; // TODO: fix an issue here
          if (!keep) queryClient.removeQueries({ queryKey: query.queryKey, exact: true }); // TODO: canceled error
          return keep;
        })
        .map((query) => query.queryKey[2])
        .sort((a, b) => b - a); 

      const startingPage = keys.length ? Math.max(...keys) : 1;
      console.log('starting page: ', startingPage) // TODO:
      const loadedPages = keys.length ? new Set(keys) : new Set([startingPage]);
      if (isNaN(startingPage) || startingPage < 1) {
        throw new Error('Invalid starting page: ' + startingPage);
      }
      setLoadedPages(loadedPages);
      fetchNewAssignments(startingPage);
    }
  }, [courseId, fetchNewAssignments, isRestoring, queryClient]);

  const asyncFetchNextPage = useCallback(async () => {
    if (isFetchingNextPage || !loadedPages.size) return;

    const nextPage = Math.min(...loadedPages) - 1;
    if (nextPage >= 1) {
      setIsFetchingNextPage(true);
      await queryClient.fetchQuery ({
        ...assignmentOptions(courseId, origin, nextPage),
      });
      setIsFetchingNextPage(false);
      setLoadedPages((prev) => new Set([...prev, nextPage].sort((a, b) => b - a)));
    }
  }, [courseId, isFetchingNextPage, loadedPages, queryClient, origin]);
  
  // merge all assignment queries into one
  const allAssignments = assignmentQueries 
    .flatMap(query => [...(query.data?.data || [])].reverse());

  return { 
    allAssignments: isRestoring ? undefined : allAssignments, 
    asyncFetchNextPage,
    isFetchingNextPage,
  }
}









// TODO: could use this idk idk idk
// export function useAssignments(courseId: string) {
//   const queryClient = useQueryClient();
//   const isRestoring = useIsRestoring();
//   const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());
//   const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
//   const [placeholderData, setPlaceholderData] = useState(); // TODO: 
  
//   const assignmentQueries = useQueries({
//     queries: [...loadedPages].map((page) => ({
//       ...assignmentOptions(courseId, page),
//       initialData: () => queryClient.getQueryData(['assignments', courseId, page])
//     }))
//   });

//   const fetchNewAssignments = useCallback(async (startingPage: number, concurrentCalls = 3) => {
//     let moreToFetch = true;
//     while (moreToFetch) {
//       const newPages = enumerate(concurrentCalls).map(i => startingPage + i);
//       const queries = await Promise.all(newPages.map((page) => (
//         queryClient.fetchQuery({
//           ...assignmentOptions(courseId, page),
//         })
//       )));

//       const pagesToAdd: number[] = [];
//       for (const [index, query] of queries.entries()) {
//         if (query.data.length) { 
//           pagesToAdd.push(newPages[index]);
//         } else {  
//           // TODO: what if you close the tab before this runs?
//           queryClient.removeQueries({ queryKey: ['assignments', courseId, newPages[index]], exact: true });
//           moreToFetch = false;
//         }
//       }
//       setLoadedPages((prev) => new Set([...prev, ...pagesToAdd].sort((a, b) => b - a)));
//       startingPage += concurrentCalls;
//     }
//   }, [courseId, queryClient]);

//   // set initial page
//   useEffect(() => {
//     if (!isRestoring) {
//       const cached = queryClient.getQueryCache().findAll();
//       const match = cached.map((query) => query.queryKey) 
//         .filter((key) => key[0] === 'assignments' && key[1] === courseId) 
//         .map((key) => key[2]); 
        
//       const startingPage = match.length ? Math.max(...match) : 1;
//       if (isNaN(startingPage) || startingPage < 1) {
//         throw new Error('Invalid starting page: ' + startingPage);
//       }
//       // get placeholder data if available 
//       const cachedData = {};
//       for (const page of match) {
//         cachedData[page] = queryClient.getQueryData(['assignments', courseId, page]);
//       }

//       setPlaceholderData(cachedData);
//       setLoadedPages(new Set([startingPage]));
//       fetchNewAssignments(startingPage);
//     }
//   }, [courseId, fetchNewAssignments, isRestoring, queryClient]);

//   // TODO: not sure if async is bad
//   const hasNextPage = (Math.min(...loadedPages) - 1) > 1;
//   const asyncFetchNextPage = useCallback(async () => {
//     if (isFetchingNextPage || !loadedPages.size) return;

//     const nextPage = Math.min(...loadedPages) - 1;
//     if (nextPage >= 1) {
//       setIsFetchingNextPage(true);
//       await queryClient.fetchQuery({
//         ...assignmentOptions(courseId, nextPage),
//       });
//       setIsFetchingNextPage(false);
//       setLoadedPages((prev) => new Set([...prev, nextPage].sort((a, b) => b - a)));
//     }
//   }, [courseId, isFetchingNextPage, loadedPages, queryClient]);
  
//   // merge all assignment queries into one
//   const allAssignments = assignmentQueries 
//     .flatMap(query => [...(query.data?.data || [])].reverse());

//   return { 
//     allAssignments, 
//     asyncFetchNextPage,
//     isFetchingNextPage,
//     hasNextPage
//   }
// }