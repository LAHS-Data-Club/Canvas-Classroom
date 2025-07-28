import { Router } from 'express';
import { oauth2Client, CLASSROOM_SCOPES } from "../config/classroomConfig";
import { asyncHandler } from '../helper/helper';
import url from 'url';

export const authRouter = Router();

// TODO: test trying to throw an error
// TODO: rest >post?
authRouter.get(
  '/api/classroom/login', 
  asyncHandler(async (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: CLASSROOM_SCOPES.join(' '),
      prompt: 'consent',
    });
    res.redirect(authUrl);
}));

authRouter.get(
  '/oauth2callback', 
  asyncHandler(async (req, res) => {
    let q = url.parse(req.url, true).query;
    let { tokens } = await oauth2Client.getToken(q.code as string); // TODO: remove the as string anx fix typing
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24, 
    }); 
    res.redirect('http://localhost:5173/login'); 
})); 

authRouter.get(
  '/api/oauth/token', 
  asyncHandler(async (req, res) => {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID!,
        client_secret: process.env.CLIENT_SECRET!,
        refresh_token: req.cookies.refresh_token,
        grant_type: 'refresh_token',
      }),
    });
    const data = await response.json();
    res.json(data);
}));

// TODO: login routes
authRouter.post('/api/canvas/login', 
  asyncHandler(async (req, res) => {
    const token = req.body.token;
    // const user = await authenticateCanvas(token); // TODO: do later
    res.cookie('canvas_token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24, 
    });
    res.redirect('http://localhost:5173/login'); 
}));

// TODO: ehh
authRouter.get('/api/canvas/auth', 
  asyncHandler(async (req, res) => {
    res.json(!!req.cookies.canvas_token);
}));

authRouter.get(
  '/api/classroom/auth', 
  asyncHandler(async (req, res) => {
    res.json(!!req.cookies.refresh_token);
}));


// TODO: this doesnt seem like best practices
// async function authenticateCanvas(token: string) {
//   if (!token) return undefined;
//   const res = await fetch('https://mvla.instructure.com/api/v1/users/self', {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   if (!res.ok) throw new Error('Failed to authenticate user.');
//   const data = await res.json();
//   return data;
// }
