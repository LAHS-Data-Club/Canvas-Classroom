// // TODO: inf query recreated using regular usequeries
// import {
//   useInfiniteQuery as _useInfiniteQuery,
//   DefaultError,
//   InfiniteData,
//   QueryKey,
//   UseInfiniteQueryOptions,
//   useQueryClient,
// } from '@tanstack/react-query';
// import { useCallback, useEffect } from 'react';

// export function useInfiniteQuery<
//   TQueryFnData,
//   TError = DefaultError,
//   TData = InfiniteData<TQueryFnData>,
//   TQueryKey extends QueryKey = QueryKey,
//   TPageParam = unknown,
// >(
//   options: UseInfiniteQueryOptions<
//     TQueryFnData,
//     TError,
//     TData,
//     TQueryFnData,
//     TQueryKey,
//     TPageParam
//   >,
// ) {
//   const queryClient = useQueryClient();
//   const { refetch: originRefetch, ...rest } = _useInfiniteQuery(options);
//   const resetPages = useCallback(() => {
//     queryClient.setQueryData<InfiniteData<unknown>>(options.queryKey, data => ({
//       pages: data?.pages.slice(0, 1) ?? [],
//       pageParams: data?.pageParams.slice(0, 1) ?? [],
//     }));
//   }, [queryClient, options.queryKey]);
//   const refetch = useCallback(() => {
//     resetPages();
//     void originRefetch();
//   }, [originRefetch, resetPages]);

//   useEffect(() => {
//     return () => {
//       resetPages();
//     };
//   }, []);
//   return { refetch, ...rest };
// }

// const query = useInfiniteQuery(options);

// const originalRefetch = query.refetch;

// query.refetch = useCallback(() => {
//   queryClient.setQueryData(queryKey, (oldData: any) => {
//     if (!oldData) return oldData;
//     return {
//       ...oldData,
//       pages: (oldData?.pages ?? []).slice(0, 1),
//       pageParams: (oldData?.pageParams ?? []).slice(0, 1),
//     };
//   });

//   return originalRefetch();
// }, [options.queryKey]);

// return query;