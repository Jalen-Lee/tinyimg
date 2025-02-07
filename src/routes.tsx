import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import AppLayout from "./components/layouts/app-layout";
import Home from "./pages/home";
import Compression from "./pages/compression";
import Settings from "./pages/settings";
import SettingsGeneral from "./pages/settings/general";
import SettingsCompression from "./pages/settings/compression";
import { Toaster } from 'sonner'

export default function AppRoutes() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/home" />} />
            <Route path="home" element={<Home />} />
            <Route path="compression" element={<Compression />} />
            <Route path="settings" element={<Settings />}>
              <Route index element={<Navigate to="/settings/general" />} />
              <Route path="general" element={<SettingsGeneral />} />
              <Route path="compression" element={<SettingsCompression />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
