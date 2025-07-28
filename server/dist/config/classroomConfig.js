import { google } from 'googleapis';
import { config } from 'dotenv';
config();
export const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, 'http://localhost:8000/oauth2callback');
export const CLASSROOM_SCOPES = [
    'https://www.googleapis.com/auth/classroom.courses',
    'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
    'https://www.googleapis.com/auth/classroom.topics.readonly',
];
