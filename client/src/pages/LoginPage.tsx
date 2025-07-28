import { useAuth } from "../contexts/AuthContext";
import { NavLink } from "react-router";

// TODO: error handling later
export default function LoginPage() {
  const { user, logInCanvas, logInClassroom } = useAuth();

  async function handleClassroomSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    logInClassroom();
  }

  async function handleCanvasSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = e.currentTarget.elements.namedItem('token') as HTMLInputElement | null;
    if (token) {
      logInCanvas(token.value);
    }
  }

  // neil generated this with claude sorry if its cluttered aodsoiahdodddaaaa i hate designing css
  return (
    <div className="w-screen flex flex-col items-center justify-center mt-30">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Welcome Back</h1>
      <div className="shadow-lg rounded-2xl p-8">
        {user?.classroom && (
          <p className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">✓ Classroom authenticated</p>
        )}
        <form onSubmit={handleClassroomSubmit} className="mb-6">
          <button 
            type="submit" 
            className="px-10 cursor-pointer w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg"
          >
            Connect Google Classroom
          </button>
        </form>

        <hr className="bg-slate-500 my-4" />

        <form onSubmit={handleCanvasSubmit} className="space-y-4">
          <label htmlFor="token" className="block text-sm font-medium text-slate-700 mb-2">
            Canvas Access Token
          </label>
          <input 
            type="text" 
            id="token" 
            name="token" 
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400"
            placeholder="Enter your Canvas token"
          />
          <button 
            type="submit" 
            className="px-10 cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg"
          >
            Connect Canvas
          </button>
        </form>
      </div>
      <NavLink to="/" className="mt-6 text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200">
        ← Back to Home
      </NavLink>
    </div>
  );
}
