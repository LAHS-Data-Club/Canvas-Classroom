import { useInfiniteQuery, useIsRestoring, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { fetchAssignmentPage } from "../api";
import { removeDuplicateIds } from "../helper";


// TODO: being weird when i switch classes
// test mounting issues
export function useAssignmentsSimpleWithInfQuery(
  courseId: string, 
  enabled: boolean,
) {
  const queryClient = useQueryClient();
  const isRestoring = useIsRestoring();
  const [startingPage, setStartingPage] = useState<number>();

  // instead could update a useState thats passed up parents or smth...
  // TODO: some sort of global state such that it does not run 10000000 times...
  const updatedData = useRef(false); 

  const newQueries = useInfiniteQuery({
    queryKey: ['assignments', courseId, 'new'],
    queryFn: async ({ pageParam }) => fetchAssignmentPage(courseId, pageParam),
    initialPageParam: startingPage + 1,
    getNextPageParam: (lastPage) => lastPage.linkHeader.next,
    enabled: startingPage !== undefined && enabled, 
  });

  const oldQueries = useInfiniteQuery({
    queryKey: ['assignments', courseId, 'old'],
    queryFn: async ({ pageParam }) => await fetchAssignmentPage(courseId, pageParam),
    initialPageParam: startingPage,
    getNextPageParam: (lastPage) => lastPage.linkHeader.prev,
    enabled: startingPage !== undefined && enabled,
  });

  // populate data via cache
  useEffect(() => {
    if (!isRestoring && !updatedData.current) {
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
        // TODO: does this cook things ? need a fallback ?
        const startingPage = Math.max(...pageParams);

        // transfer newData to oldData and clear newData cache
        queryClient.setQueryData(['assignments', courseId, 'old'], { pageParams, pages });
        queryClient.setQueryData(['assignments', courseId, 'new'], { pageParams: [], pages: [] });
        setStartingPage(startingPage);
      } else {
        setStartingPage(1); 
      }
      updatedData.current = true;
    }
  }, [isRestoring, courseId, queryClient]);

  // fetch all newest assignments
  useEffect(() => {
    if (newQueries.hasNextPage && !newQueries.isFetchingNextPage) {
      console.log('fetching newData for courseId ', courseId)
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