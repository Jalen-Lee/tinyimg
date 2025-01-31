import SidebarNav from "./sidebar-nav";
import ErrorBoundary from "../error-boundary";
import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <div className="flex">
      <SidebarNav />
      <div className="relative flex h-screen w-full overflow-hidden bg-gray-100">
        <ErrorBoundary>
          <main className="flex flex-1 flex-col">
            <div className="flex-1 overflow-y-auto">
              <div
                data-tauri-drag-region="true"
                className="draggable h-6 w-full"
              ></div>
              <Outlet />
            </div>
          </main>
        </ErrorBoundary>
      </div>
    </div>
  );
}
