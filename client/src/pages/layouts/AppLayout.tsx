import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router"
import { coursesOptions } from "../../queryOptions/options";
import { ProtectedRoute } from "../../functions/auth/useAuth";
import Sidebar from "../../components/Sidebar";

export default function AppLayout() {
  const { data, isPending, isError } = useQuery(coursesOptions());

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error loading courses</p>;

  return (
    <div className="w-screen flex">
      <ProtectedRoute>
        <Sidebar courses={data} />
        <main className="ml-72 w-full"> 
          <Outlet />
        </main>
      </ProtectedRoute>
    </div>
  );
}
