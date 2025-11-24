import { Routes, Route, useNavigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { ModalViewer } from "react-easetools";
import { UserState } from "./state/UserState";
import { autoLoginService } from "./services/auth.service";
import { useEffect } from "react";

const publicRoutes = ["/login", "/register", "/forgot-password"];

function App() {
  const user_state = UserState();
  const user_state_data = user_state.get();
  const is_logged_in = user_state_data?.user_data ? true : false;

  const navigate = useNavigate();
  const auto_login = async () => {
    try {
      await autoLoginService();

      navigate("/dashboard");
    } catch (error) {
      const currentPath = location.pathname;

      // if route is NOT public → redirect to login
      if (!publicRoutes.includes(currentPath)) {
        navigate("/login");
      }
    }
  };
  useEffect(() => {
    auto_login();
  }, []);
  return (
    <>
      <ModalViewer />
      <Routes>
        {is_logged_in ? (
          <Route path="*" element={<Dashboard />} />
        ) : (
          <Route path="*" element={<Auth />} />
        )}

        {/* <Route path="*" element={<Navigate to="/dashboard/home" replace />} /> */}
      </Routes>
    </>
  );
}

export default App;
