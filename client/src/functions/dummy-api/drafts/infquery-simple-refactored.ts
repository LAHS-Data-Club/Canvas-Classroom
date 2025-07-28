import { useInfiniteQuery, useIsRestoring, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchAssignmentPage } from "../api";
import { removeDuplicateIds } from "../helper";


// TODO: issue is this will fetch ALL queries and i cannot really nicely stop this fetching...
// TODO: i can look into manually caching data and storing it as placeholder data instead of initial data?
export function useAssignmentsSimpleWithInfQuery2(
  courseId: string, 
) {
  const queryClient = useQueryClient();
  const isRestoring = useIsRestoring();
  const [startingPage, setStartingPage] = useState<number>();

  const newQueries = useInfiniteQuery({
    queryKey: ['assignments', courseId, 'new'],
    queryFn: async ({ pageParam }) => fetchAssignmentPage(courseId, pageParam),
    initialPageParam: startingPage + 1,
    getNextPageParam: (lastPage) => lastPage.linkHeader.next,
    enabled: startingPage !== undefined, 
  });

  const oldQueries = useInfiniteQuery({
    queryKey: ['assignments', courseId, 'old'],
    queryFn: async ({ pageParam }) => await fetchAssignmentPage(courseId, pageParam),
    initialPageParam: startingPage,
    getNextPageParam: (lastPage) => lastPage.linkHeader.prev,
    enabled: startingPage !== undefined,
  });

  useEffect(() => {
    // cleanup: merge new queries and old queries
    return () => {
      const newData = queryClient.getQueryData(['assignments', courseId, 'new']);
      const oldData = queryClient.getQueryData(['assignments', courseId, 'old']);
      // extract largest pageparam from new/old data and set as new page
      if (newData && oldData) {
        const pageParams = [...newData.pageParams, ...oldData.pageParams];
        const pages = [...newData.pages, ...oldData.pages];
        // TODO: a little unreadable but wtv it doesnt have to look pretty
        for (let i = 0; i < pageParams.length; i++) {
          if (!pages[i].assignments.length) {
            pageParams.splice(i, 1);
            pages.splice(i, 1);
            i--;
          }
        }
        // transfer newData to oldData and clear newData cache
        queryClient.setQueryData(['assignments', courseId, 'old'], { pageParams, pages });
        queryClient.setQueryData(['assignments', courseId, 'new'], { pageParams: [], pages: [] });
      } 
    };
  }, [courseId]);

  // populate data via cache
  // TODO: Math.max of an empty array is -inf
  useEffect(() => {
    if (!isRestoring) {
      const newData = queryClient.getQueryData(['assignments', courseId, 'new']);
      const oldData = queryClient.getQueryData(['assignments', courseId, 'old']);
      // extract largest pageparam from new/old data and set as new page
      if (newData && oldData) {
        const pageParams = [...newData.pageParams, ...oldData.pageParams];
        const startingPage = Math.max(...pageParams);
        setStartingPage(startingPage);
        console.log(startingPage);
      } else {
        setStartingPage(1); 
      }
    }
  }, [isRestoring, courseId, queryClient]);

  // fetch all newest assignments
  useEffect(() => {
    if (newQueries.hasNextPage && !newQueries.isFetchingNextPage) {
      console.log('fetching newData for courseId ', courseId);
      newQueries.fetchNextPage();
    }
  }, [newQueries]);

  const newAssignments = newQueries.data?.pages.flatMap((group) => group.assignments) || [];
  const oldAssignments = oldQueries.data?.pages.flatMap((group) => group.assignments) || [];
  const allAssignments = removeDuplicateIds([...newAssignments.reverse(), ...oldAssignments]);

  return { 
    allAssignments, 
    fetchNextPage: oldQueries.fetchNextPage, 
    hasNextPage: oldQueries.hasNextPage, 
    isFetchingNextPage: oldQueries.isFetchingNextPage,
  };
}