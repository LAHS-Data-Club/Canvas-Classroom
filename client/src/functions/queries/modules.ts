import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchModulePage } from "../api";

export function useModuleItems(
  courseId: string,
  moduleId: string, 
  assignmentQuery: any,
  origin: string,
  enabled: boolean
) {
  if (origin !== 'canvas' && origin !== 'classroom') {
    throw new Error(`Invalid origin ${origin}`);
  }
  const canvasQuery = useCanvasModuleItems(courseId, moduleId, (enabled && origin === 'canvas'));
  const classroomQuery = useClassroomModuleItems(assignmentQuery, moduleId);
  return origin === 'canvas' ? canvasQuery : classroomQuery;
}


// below is DUBIOUS as hell...
function useCanvasModuleItems(
  courseId: string, 
  moduleId: string, 
  enabled: boolean,
) {
  const moduleQuery = useInfiniteQuery({
    queryKey: ['modules', courseId, moduleId],
    queryFn: ({ pageParam }) => fetchModulePage(courseId, moduleId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.linkHeader.next,
    enabled,
  });
  const allModuleItems = moduleQuery.data?.pages
    .flatMap(page => page.data) || [];
  return { allModuleItems , ...moduleQuery, }; 
}

// TODO: it runs but it doesnt rly work ... hmm

// TODO: umm this is rly not the best way... maybe make classroom not do pagination as much since its so much quicker ??
function useClassroomModuleItems(
  assignmentQuery: any, // TODO: 
  moduleId: string
) {
  // console.log(assignmentQuery.allAssignments)
  const allModuleItems = assignmentQuery.allAssignments
    ?.filter(a => a.moduleId === moduleId) || []; 

  const fetchNextPage = useCallback(async () => {
    console.log('running this');
    if (assignmentQuery.hasNextPage || !assignmentQuery.isFetchingNextPage) {
      assignmentQuery.fetchNextPage();
    }
  }, [assignmentQuery]);

  return {
    allModuleItems,
    isPending: assignmentQuery.hasNextPage,
    isLoading: assignmentQuery.isLoading,
    hasNextPage: assignmentQuery.hasNextPage,
    fetchNextPage: fetchNextPage,
    isError: assignmentQuery.isError,
  }
}