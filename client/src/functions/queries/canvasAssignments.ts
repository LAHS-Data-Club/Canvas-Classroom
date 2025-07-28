import { useIsRestoring, useQueries, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { assignmentOptions } from "../../queryOptions/options";
import { enumerate } from "../helper";
import type { AssignmentGroup } from "../../library/types";

export function useCanvasAssignments(courseId: string, origin: string) {
  const queryClient = useQueryClient();
  const isRestoring = useIsRestoring();
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  
  const assignmentQueries = useQueries({
    queries: [...loadedPages].map((page) => ({
      ...assignmentOptions(courseId, origin, page),
      enabled: origin === 'canvas',
    }))
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
  }, [courseId, queryClient, origin]);

  // set initial page from cache
  useEffect(() => {
    if (!isRestoring && origin === 'canvas') {
      const cached = queryClient.getQueryCache().findAll();
      const keys = cached
        .filter((query) => query.queryKey[0] === 'assignments' && query.queryKey[1] === courseId)
        .filter((query) => { // remove empty queries
          const data = query.state.data as AssignmentGroup | undefined
          const keep = data?.data.length; 
          if (!keep) queryClient.removeQueries({ queryKey: query.queryKey, exact: true }); // TODO: canceled error
          return keep;
        })
        .map<number>((query) => query.queryKey[2] as number)
        .sort((a, b) => b - a); 

      const startingPage = keys.length ? Math.max(...keys) : 1;
      const loadedPages = keys.length ? new Set(keys) : new Set([startingPage]);
      if (isNaN(startingPage) || startingPage < 1) {
        throw new Error('Invalid starting page: ' + startingPage);
      }
      setLoadedPages(loadedPages);
      fetchNewAssignments(startingPage);
    }
  }, [courseId, fetchNewAssignments, isRestoring, queryClient, origin]);

  // TODO: different from infinite query in how its updated
  const fetchNextPage = useCallback(async () => {
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

  // TODO: isError, hasNextPage
  return { 
    allAssignments: isRestoring ? undefined : allAssignments, 
    fetchNextPage,
    hasNextPage: true,
    isFetchingNextPage,
    isPending: isFetchingNextPage,
  }
}
