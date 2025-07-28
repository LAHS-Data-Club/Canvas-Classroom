import { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { BrowserRouter, Routes, Route } from "react-router";
 
import AppLayout from "./pages/layouts/AppLayout";
import ClassPage from "./pages/ClassPage";
import AssignmentPage from "./pages/AssignmentPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage"; 

import { AuthProvider } from "./functions/auth/useAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false
    }
  }
});

export default function App() {
  const asyncStoragePersister = createAsyncStoragePersister({
    storage: window.localStorage,
  }); 

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ 
        persister: asyncStoragePersister 
      }}
      onSuccess={() => {
        console.log('query client restored. invalidating course query');
        console.log(queryClient.getQueryCache().findAll());
        // queryClient.invalidateQueries(); // TODO: this is not refetching
      }}
    >
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="login" element={<LoginPage />} />
              <Route element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="courses/:origin/:courseId" element={<ClassPage />} />
                <Route path="courses/:origin/:courseId/:assignmentId" element={<AssignmentPage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
}
