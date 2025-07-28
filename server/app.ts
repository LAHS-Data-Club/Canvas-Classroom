import express from 'express';
import cookieParser from 'cookie-parser';
import { asyncHandler } from './src/helper/helper';
import { authRouter } from './src/routers/authRouter';
import { 
  getCanvasModulePage 
} from './src/functions/canvas/canvas';
import { getCourseModules, getCourseAssignment, getCourses } from './src/functions/combined';

const app = express();
app.use(express.json());
app.use(cookieParser());

const TOKEN = '10497~B6tWRntMNzDCmWhW7fAAQNaFThETLaTwV8G6JXKRuHfYhWaxft73TDrvHtNVeUBY';

// TODO: planner, not sure how to do that
// TODO: i forgot about the whole rel=last scenario ; maybe use that instead we'll see
// TODO: combine with classroom

// login routers
app.use('/', authRouter);

app.get('/api/courses', 
  asyncHandler(async (req, res) => {
    getCourses(
      TOKEN, 
      req.cookies.refresh_token
    ).then((data) => res.json(data));
}));

app.get('/api/courses/:courseId/modules', 
  asyncHandler(async (req, res) => {
    getCourseModules(
      TOKEN,
      req.cookies.refresh_token,
      req.params.courseId,
      req.query.origin as string
    ).then((data) => res.json(data));
}));

app.get('/api/courses/:courseId/assignments', 
  asyncHandler(async (req, res) => {
    getCourseAssignment(
      TOKEN,
      req.cookies.refresh_token,
      req.params.courseId,
      req.query.page as string,
      req.query.origin as string
    ).then((data) => res.json(data));
}));

// TODO:  oooooo asdasdasd
app.get('/api/courses/:courseId/modules/:moduleId/items', 
  asyncHandler(async (req, res) => {
    getCanvasModulePage(
      TOKEN,
      req.params.courseId,
      req.params.moduleId,
      req.query.page as string
    ).then((data) => res.json(data));
}));

const PORT = 8000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
