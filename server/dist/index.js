import express from 'express';
import cookieParser from 'cookie-parser';
import { asyncHandler } from './helper/helper.js';
import { authRouter } from './routers/authRouter.js';
import { getCanvasModulePage } from './functions/canvas/canvas.js';
import { getCourseModules, getCourseAssignment, getCourses } from './functions/combined.js';
const app = express();
app.use(express.json());
app.use(cookieParser());
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, '../client/dist')));
// TODO: planner, not sure how to do that
// TODO: i forgot about the whole rel=last scenario ; maybe use that instead we'll see
// TODO: combine with classroom
// login routers
app.use('/', authRouter);
app.get('/api/courses', asyncHandler(async (req, res) => {
    getCourses(req.cookies.canvas_token, req.cookies.refresh_token).then((data) => res.json(data));
}));
app.get('/api/courses/:courseId/modules', asyncHandler(async (req, res) => {
    getCourseModules(req.cookies.canvas_token, req.cookies.refresh_token, req.params.courseId, req.query.origin).then((data) => res.json(data));
}));
app.get('/api/courses/:courseId/assignments', asyncHandler(async (req, res) => {
    getCourseAssignment(req.cookies.canvas_token, req.cookies.refresh_token, req.params.courseId, req.query.page, req.query.origin).then((data) => res.json(data));
}));
// TODO:  oooooo asdasdasd
app.get('/api/courses/:courseId/modules/:moduleId/items', asyncHandler(async (req, res) => {
    getCanvasModulePage(req.cookies.canvas_token, req.params.courseId, req.params.moduleId, req.query.page).then((data) => res.json(data));
}));
// app.get('/{*any}',  asyncHandler(async (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
// }));
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
