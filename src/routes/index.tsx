import { Routes, Route } from "react-router-dom";
import { routes } from "./paths";
import LandingPage from "../pages/LandingPage/LandingPage";
import LoginPage from "../pages/Auths/Login";
import RegisterPage from "../pages/Auths/Register";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={routes.landing} element={<LandingPage />} />
      <Route path={routes.login} element={<LoginPage />} />
      <Route path={routes.register} element={<RegisterPage />} />
    </Routes>
  );
}
