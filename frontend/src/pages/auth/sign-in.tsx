import { useState } from "react";
import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";

import { loginService } from "@/services/auth.service";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string; general?: string } =
      {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
    }

    if (!agreedToTerms) {
      newErrors.general = "Please agree to the Terms and Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const on_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await loginService(email.trim(), password);

      navigate("/dashboard");
    } catch (error: any) {
      const errorMessage =
        error?.message || "An error occurred during login. Please try again.";
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Demo login function for quick access
  const handleDemoLogin = async (role: "admin" | "doctor" | "patient") => {
    setErrors({});
    setLoading(true);

    // Demo credentials for each role
    const password = "Password123!";
    const demoCredentials = {
      admin: {
        email: "admin@hcl.com",
        password,
      },
      doctor: {
        email: "alice.morton@hcl.com",
        password,
      },
      patient: {
        email: "emily.carter@hcl.com",
        password,
      },
    };

    const credentials = demoCredentials[role];

    try {
      await loginService(credentials.email, credentials.password);
      navigate("/dashboard");
    } catch (error: any) {
      const errorMessage =
        error?.message || `Failed to login as ${role}. Please try again.`;
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Sign In
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Enter your email and password to Sign In.
          </Typography>
        </div>
        <form
          className="mt-8 mb-2 mx-auto w-full max-w-screen-lg lg:w-1/2"
          onSubmit={on_submit}
        >
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <Typography variant="small" color="red" className="font-medium">
                {errors.general}
              </Typography>
            </div>
          )}
          <div className="mb-1 flex flex-col gap-6">
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              error={!!errors.email}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              crossOrigin={undefined}
            />
            {errors.email && (
              <Typography variant="small" color="red" className="-mt-3">
                {errors.email}
              </Typography>
            )}
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors({ ...errors, password: undefined });
              }}
              error={!!errors.password}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              crossOrigin={undefined}
            />
            {errors.password && (
              <Typography variant="small" color="red" className="-mt-3">
                {errors.password}
              </Typography>
            )}
          </div>
          <Checkbox
            checked={agreedToTerms}
            onChange={(e) => {
              setAgreedToTerms(e.target.checked);
              if (errors.general) setErrors({ ...errors, general: undefined });
            }}
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
            crossOrigin={undefined}
          />
          <Button
            className="mt-6"
            fullWidth
            type="submit"
            disabled={loading}
            onClick={on_submit}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          {/* Demo Login Section */}
          <div className="mt-8 pt-6 border-t border-blue-gray-100">
            <Typography
              variant="small"
              className="text-center text-blue-gray-600 font-medium mb-4"
            >
              Quick Demo Login
            </Typography>
            <div className="grid grid-cols-1 gap-3">
              <Button
                size="sm"
                variant="outlined"
                color="blue"
                className="flex items-center justify-center gap-2"
                onClick={() => handleDemoLogin("admin")}
                disabled={loading}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Login as Admin
              </Button>
              <Button
                size="sm"
                variant="outlined"
                color="green"
                className="flex items-center justify-center gap-2"
                onClick={() => handleDemoLogin("doctor")}
                disabled={loading}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Login as Doctor
              </Button>
              <Button
                size="sm"
                variant="outlined"
                color="purple"
                className="flex items-center justify-center gap-2"
                onClick={() => handleDemoLogin("patient")}
                disabled={loading}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Login as Patient
              </Button>
            </div>
            <Typography
              variant="small"
              className="text-center text-blue-gray-500 mt-3 text-xs"
            >
              Demo credentials are auto-filled for testing purposes
            </Typography>
          </div>

          {/* <div className="flex items-center justify-between gap-2 mt-6">
            <Checkbox
              crossOrigin={undefined}
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center justify-start font-medium"
                >
                  Subscribe me to newsletter
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">
                Forgot Password
              </a>
            </Typography>
          </div> */}

          <Typography
            variant="paragraph"
            className="text-center text-blue-gray-500 font-medium mt-4"
          >
            Not registered?
            <Link to="/register" className="text-gray-900 ml-1">
              Create account
            </Link>
          </Typography>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
          title="Pattern background"
          alt="Pattern background"
        />
      </div>
    </section>
  );
}

export default SignIn;
