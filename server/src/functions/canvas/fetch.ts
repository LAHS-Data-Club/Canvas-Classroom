// TODO: really dubious typescript but um its ok maybe...

import { parse } from "path";

const BASE = 'https://mvla.instructure.com';

// export async function fetchAll<T>(
//   token: string,
//   endpoint: string,
//   callback: (res: any) => T[], 
//   params?: URLSearchParams, 
// ): Promise<T[]> { 
//   const { data, linkHeader } = await xfetch(token, endpoint, callback, params);

//   const nextLink = linkHeader 
//     ?.split(',')
//     .find((l) => l.includes('rel="next"'))
//     ?.match(/<(.+)>/)?.[1];

//   if (nextLink) {
//     const nextParams = new URLSearchParams(nextLink.match(/\?(.+)/)?.[1]);
//     const nextData = await fetchAll(token, endpoint, callback, nextParams);
//     return [...data, ...nextData];
//   }
//   return data;
// }

// export async function xfetch<T>(
//   token: string,
//   endpoint: string,
//   callback: (res: any) => T[], 
//   params?: URLSearchParams, 
// ): Promise<{ data: T[]; linkHeader: any }> {
//   const formattedParams = params?.toString() ?? '';
//   const url = `${BASE}/api/v1/${endpoint}?${formattedParams}`;
//   const res = await fetch(url, {
//     method: 'GET',
//     headers: {
//       Accept: "application/json", 
//       Authorization: `Bearer ${token}`
//     }
//   });
//   if (!res.ok) {
//     throw new Error('Failed to fetch data.');
//   }
//   const data = await res.json().then((res) => callback(res));
//   const linkHeader = res.headers.get('link'); 
//   return { data, linkHeader }
// }

interface LinkHeader {
  next?: number | null;
  prev?: number | null;
  curr?: number | null,
}

export async function fetchAll<T>(
  token: string,
  endpoint: string,
  callback: (res: any) => T[], 
  params?: URLSearchParams, 
): Promise<T[]> { 
  const { data, linkHeader } = await xfetch(token, endpoint, callback, params);
  const page = linkHeader.next;
  if (page) {
    const nextParams = new URLSearchParams(params?.toString());
    nextParams.set('page', page);
    const nextData = await fetchAll(token, endpoint, callback, nextParams);
    return [...data, ...nextData];
  }
  return data;
}

export async function xfetch<T>(
  token: string,
  endpoint: string,
  callback: (res: any) => T[], 
  params?: URLSearchParams, 
): Promise<{ data: T[]; linkHeader: any }> {
  const formattedParams = params?.toString() ?? '';
  const url = `${BASE}/api/v1/${endpoint}?${formattedParams}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: "application/json", 
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) {
    console.log(res);
    throw new Error('Failed to fetch data.');
  };
  const data = await res.json().then((res) => callback(res));

  // create pagination headers
  // TODO: kinda weird paging but its ok
  const headers = res.headers.get('link')?.split(',');
  const curr = headers
    ?.find((l) => l.includes('rel="current"'))
    ?.match(/page=(\d+)/)?.[1] as string;

  const pageInfo: LinkHeader = { curr: parseInt(curr) };
  if (headers && data.length) { 
    if (headers.find((h) => h.includes('rel="next"'))) pageInfo.next = parseInt(curr) + 1;
    if (headers.find((h) => h.includes('rel="prev"'))) pageInfo.prev = parseInt(curr) - 1;
  }
  return { data, linkHeader: pageInfo }
}