import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center h-full m-0 p-0">
      <Navbar />
      <main className="w-full max-w-[70vw] min-w-[50vw] flex flex-col justify-center items-center gap-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;