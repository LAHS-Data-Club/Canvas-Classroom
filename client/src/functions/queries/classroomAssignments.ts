import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAssignmentPage } from "../api";

// TODO: deal with pagetokens expiring KMS
// TODO: what happens on a load?? that causes this to be undef
export function useClassroomAssignments(courseId: string, origin: string) {
  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['assignments', courseId],
    queryFn: ({ pageParam }) => fetchAssignmentPage(courseId, 'classroom', pageParam),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.linkHeader.next,
    enabled: origin === 'classroom'
  });

  const allAssignments = data?.pages.flatMap(page => page.data);

  // TODO: isError
  return {
    allAssignments,
    isPending, 
    isFetchingNextPage, 
    hasNextPage,
    fetchNextPage 
  }
}