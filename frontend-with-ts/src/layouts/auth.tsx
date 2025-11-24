import { SignIn, SignUp } from "@/pages/auth";
import SignUpPatient from "@/pages/auth/patient/sign-up";
import { Route, Routes } from "react-router-dom";

export function Auth() {
  return (
    <div className="relative min-h-screen w-full">
      <Routes>
        <Route path={"login"} element={<SignIn />} />
        <Route path={"register"} element={<SignUpPatient />} />
      </Routes>
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.tsx";

export default Auth;
