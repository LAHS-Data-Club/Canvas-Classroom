import { useEffect, useState } from "react";
import { AuthContext, useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router";

interface User {
  canvas: boolean;
  classroom: boolean;
}

// TODO: error handling
export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getIsLoggedIn();
      setUser(res);
      setIsLoading(false);
    })();
  }, []);

  async function getIsLoggedIn() {
    const data = await Promise.all([
      fetch('/api/canvas/auth'),
      fetch('/api/classroom/auth'),
    ]).then((res) => Promise.all(res.map((r) => r.json()))); 
    return { canvas: data[0], classroom: data[1] };
  }

  async function logInCanvas(token: string) {
    fetch('/api/canvas/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token }), // TODO: how to clear body ??
    });
  }

  function logInClassroom() {
    console.log('running this') //hwy does htis ugahohasdoihasoiasd kms,s
    window.location.href = '/api/classroom/login'; 
  }

  return (
    <AuthContext.Provider value={{ user, logInClassroom, logInCanvas, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const { user, isLoading } = useAuth(); 
  const proceed = user?.canvas || user?.classroom;

  if (isLoading) return <p>Loading...</p>;
  if (!proceed) return <Navigate to="/login" />;
  return children;
};