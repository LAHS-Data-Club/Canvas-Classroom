import { createContext, useContext } from "react";

export const AuthContext = createContext<{
  user: { canvas: boolean; classroom: boolean } | null;
  isLoading: boolean;
  logInClassroom: () => void;
  logInCanvas: (token: string) => Promise<void>;
}>({ 
  user: null, 
  isLoading: true,
  logInClassroom: () => {},
  logInCanvas: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};