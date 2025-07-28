import { createContext } from "react";
import type { AssignmentQuery } from "../library/types";

export const CourseworkContext = createContext<{
  assignmentQuery: AssignmentQuery | null,
}>({
  assignmentQuery: null,
});