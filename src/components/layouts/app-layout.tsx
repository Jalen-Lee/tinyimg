import SidebarNav from "./sidebar-nav";
import ErrorBoundary from "../error-boundary";
import { Outlet } from "react-router";
import { useEffect } from "react";
import { emit, listen } from "@tauri-apps/api/event";
import { message } from '@tauri-apps/plugin-dialog';

export default function AppLayout() {

  // Handle CLI args and sources passed from backend (like for file extension)
  useEffect(() => {
    let isMounted = true;
    let unlisten: (() => void) | null = null;

    // File passed from file extension
    listen("inspect", (event) => {
      const path = event.payload as string;
      message(path, { title: 'Tauri3', kind: 'info' });
    })
      .then((unlistenFn) => {
        if (isMounted) {
          unlisten = unlistenFn;
        } else {
          unlistenFn();
        }
      })
      .catch(()=>{

      });

    // Tell the backend that the frontend is ready for inspect requests
    emit("ready").catch(()=>{

    });

    return () => {
      isMounted = false;
      if (unlisten) {
        unlisten();
      }
    };
  }, []);


  return (
    <div className="flex w-screen h-screen">
      <SidebarNav />
      <div className="h-screen flex-1 bg-gray-100">
        <ErrorBoundary>
          <main className="h-full relative overflow-hidden">
            <div
              data-tauri-drag-region="true"
              className="draggable h-6 w-full absolute top-0 left-0 z-50"
            ></div>
            <div className="h-full">
              <Outlet/>
            </div>
          </main>
        </ErrorBoundary>
      </div>
    </div>
  );
}
