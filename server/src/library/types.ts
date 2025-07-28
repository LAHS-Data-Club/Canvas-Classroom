export interface Course {
  id: string;
  name: string;
  url: string | null;
  origin: 'canvas' | 'classroom';
}

export interface Module {
  id: string;
  courseId: string;
  name: string;
  itemsCount: number | undefined;
  origin: 'canvas' | 'classroom';
}

export interface Assignment {
  id: string;
  title: string;
  description: string | null;
  courseId: string;
  materials: any; // TODO
  dueDate: string | null;
  points: number | null;
  url: string;
  origin: 'canvas' | 'classroom';
}

// type: Assignment, subheader, externalurl, (other?)
export interface ModuleItem {
  id: string,
  title: string,
  position: number, // think it just gives in the normal order
  type: "Assignment" | "Subheader" | "ExternalUrl" // or other,
  content_id: string | undefined,
  assignment: Assignment | undefined
  link: string | undefined
  origin: 'canvas' | 'classroom';
}

export interface AssignmentGroup {
  data: Assignment[],
  linkHeader: any
}


