import { google } from 'googleapis';
import { oauth2Client } from '../../config/classroomConfig.js';
const classroom = google.classroom({ version: 'v1' });
export async function fetchAll(token, endpoint, callback, params = {}) {
    const { data, linkHeader } = await xfetch(token, endpoint, callback, params);
    if (linkHeader.next) {
        const nextParams = { ...params, pageToken: linkHeader.next };
        const nextData = await fetchAll(token, endpoint, callback, nextParams);
        return [...data, ...nextData];
    }
    return data;
}
export async function xfetch(token, endpoint, callback, params = {}) {
    const start = performance.now();
    oauth2Client.setCredentials({ refresh_token: token });
    const keys = endpoint.split('.');
    const target = keys.reduce((target, key) => target[key], classroom);
    const res = await target.list({
        auth: oauth2Client,
        pageSize: 20, // TODO:
        ...params
    });
    const data = callback(res.data);
    const next = res.data.nextPageToken;
    const end = performance.now();
    console.log(`fetch for ${endpoint} took ${end - start}ms`);
    return { data, linkHeader: { next } };
}
