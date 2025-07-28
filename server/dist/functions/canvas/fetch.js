// TODO: really dubious typescript but um its ok maybe...
const BASE = 'https://mvla.instructure.com';
export async function fetchAll(token, endpoint, callback, params) {
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
export async function xfetch(token, endpoint, callback, params) {
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
    }
    ;
    const data = await res.json().then((res) => callback(res));
    // create pagination headers
    // TODO: kinda weird paging but its ok
    const headers = res.headers.get('link')?.split(',');
    const curr = headers
        ?.find((l) => l.includes('rel="current"'))
        ?.match(/page=(\d+)/)?.[1];
    const pageInfo = { curr: parseInt(curr) };
    if (headers && data.length) {
        if (headers.find((h) => h.includes('rel="next"')))
            pageInfo.next = parseInt(curr) + 1;
        if (headers.find((h) => h.includes('rel="prev"')))
            pageInfo.prev = parseInt(curr) - 1;
    }
    return { data, linkHeader: pageInfo };
}
