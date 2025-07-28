import { useCanvasAssignments } from "./canvasAssignments";
import { useClassroomAssignments } from "./classroomAssignments";
import type { AssignmentQuery } from "../../library/types";

// TODO: i dont like this structure lol...
export function useAssignments(
  courseId: string, 
  origin: string
): AssignmentQuery {
  if (origin !== 'canvas' && origin !== 'classroom') {
    throw new Error(`Invalid origin ${origin}`);
  }
  const canvasQuery = useCanvasAssignments(courseId, origin);
  const classroomQuery = useClassroomAssignments(courseId, origin);
  return origin === 'canvas' ? canvasQuery : classroomQuery;
}



















// TODO: old stuff ignore lol
// maybe this is too slow ...
// // canvas assignments hook
// export function useAssignmentsSimpleWithInfQueryAndReset(
//   courseId: string, 
// ) {
//   const queryClient = useQueryClient();
//   const isRestoring = useIsRestoring();
//   const [startingPage, setStartingPage] = useState<number>();
//   const [placeholderData, setPlaceholderData] = useState();

//   const newQueries = useInfiniteQuery({
//     queryKey: ['assignments', courseId, 'new'],
//     queryFn: async ({ pageParam }) => {
//       console.log('fetching new page: ' + pageParam);
//       return await fetchAssignmentPage(courseId, pageParam);
//     },
//     initialPageParam: startingPage + 1,
//     getNextPageParam: (lastPage) => lastPage.linkHeader.next,
//     enabled: startingPage !== undefined, 
//   });

//   const oldQueries = useInfiniteQuery({
//     queryKey: ['assignments', courseId, 'old'],
//     queryFn: async ({ pageParam }) => {
//       console.log('fetching old page: ' + pageParam);
//       return await fetchAssignmentPage(courseId, pageParam);
//     },
//     initialPageParam: startingPage,
//     getNextPageParam: (lastPage) => lastPage.linkHeader.prev,
//     enabled: startingPage !== undefined,
//   });

//   useEffect(() => {
//     if (!isRestoring) {
//       const newData = queryClient.getQueryData(['assignments', courseId, 'new']);
//       const oldData = queryClient.getQueryData(['assignments', courseId, 'old']);
//       // merge cached data and reset queries
//       if (newData && oldData) {
//         const pageParams = [...newData.pageParams, ...oldData.pageParams];
//         const pages = [...newData.pages, ...oldData.pages];
//         // remove empty pages 
//         for (let i = 0; i < pageParams.length; i++) {
//           if (!pages[i].data.length) {
//             pageParams.splice(i, 1);
//             pages.splice(i, 1);
//             i--;
//           }
//         }
//         const startingPage = Math.min(...pageParams);
//         if (isNaN(startingPage) || startingPage < 1) {
//           throw new Error('Invalid starting page: ' + startingPage);
//         } else {
//           setStartingPage(startingPage);
//           setPlaceholderData({ pageParams, pages });
//           queryClient.resetQueries({ queryKey: ['assignments', courseId, 'old'], exact: true });
//           queryClient.resetQueries({ queryKey: ['assignments', courseId, 'new'], exact: true });
//         }
//       } else {
//         setStartingPage(1); 
//       }
//     }
//   }, [isRestoring, courseId, queryClient]);

//   // fetch all newest assignments
//   // TODO: change to be more efficient
//   useEffect(() => {
//     if (newQueries.hasNextPage && !newQueries.isFetchingNextPage) {
//       newQueries.fetchNextPage();
//     }
//   }, [newQueries]);

//   // merge old, new, placeholder assignments
//   const newAssignments = newQueries.data?.pages.flatMap((group) => group.data) || [];
//   const oldAssignments = oldQueries.data?.pages.flatMap((group) => group.data) || [];
//   const allAssignments = removeDuplicateIds([...newAssignments.reverse(), ...oldAssignments]);

//   return { 
//     allAssignments, 
//     placeholderData,
//     fetchNextPage: oldQueries.fetchNextPage, 
//     hasNextPage: oldQueries.hasNextPage, 
//     isFetchingNextPage: oldQueries.isFetchingNextPage,
//   };
// }
