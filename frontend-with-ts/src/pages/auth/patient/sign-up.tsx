import {
  Input,
  Checkbox,
  Button,
  Typography,
  Card,
  CardBody,
  Avatar,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  registerPatient,
  getAllDoctors,
  assignDoctorsToPatient,
} from "@/services/patient.service";
import { VModal } from "@/utils/VModal";
import { addTokenToLocalStorage } from "@/utils/Local-Storage";

interface Doctor {
  id: string;
  specialization: string;
  education: string;
  experience_years: number;
  bio?: string;
  user: {
    id: string;
    name: string;
    email_id: string;
    phone_no: string;
  };
}

export function SignUpPatient() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [patientId, setPatientId] = useState("");
  const [token, setToken] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    phone: "",
    dob: "",
    gender: "",
    agree: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch doctors when step 2 is reached
  useEffect(() => {
    if (step === 2) {
      fetchDoctors();
    }
  }, [step]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await getAllDoctors();
      setDoctors(data);
    } catch (error: any) {
      console.error("Error fetching doctors:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    const tempErrors: Record<string, string> = {};

    if (!formData.name.trim()) tempErrors.name = "Name is required.";
    if (!formData.email.trim()) tempErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Enter a valid email address.";

    if (!formData.password.trim())
      tempErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      tempErrors.password = "Password must be at least 6 characters.";

    if (formData.password !== formData.repeatPassword)
      tempErrors.repeatPassword = "Passwords do not match.";

    if (!formData.phone.trim()) tempErrors.phone = "Phone number is required.";
    else if (!/^[0-9]{10}$/.test(formData.phone))
      tempErrors.phone = "Enter a valid 10-digit phone number.";

    if (!formData.dob) tempErrors.dob = "Date of birth is required.";
    if (!formData.gender) tempErrors.gender = "Please select your gender.";
    if (!formData.agree) tempErrors.agree = "You must agree to the terms.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleStep1Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true);
        const payload = {
          name: formData.name,
          email_id: formData.email,
          password: formData.password,
          phone_no: formData.phone,
          dob: formData.dob,
          role: "user",
        };

        const response = await registerPatient(payload);
        setPatientId(response.data.id);
        setToken(response.token);
        setStep(2); // Move to doctor selection
      } catch (error: any) {
        console.error("Error registering patient:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleDoctorSelection = (doctorId: string) => {
    setSelectedDoctors((prev) =>
      prev.includes(doctorId)
        ? prev.filter((id) => id !== doctorId)
        : [...prev, doctorId]
    );
  };

  const showDoctorDetails = async (doctor: Doctor) => {
    await VModal({
      title: null,
      body: () => (
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <Avatar
              src={`https://ui-avatars.com/api/?name=${doctor.user.name}&background=random`}
              alt={doctor.user.name}
              size="xl"
            />
            <div>
              <Typography variant="h5">{doctor.user.name}</Typography>
              <Typography variant="small" color="gray">
                {doctor.specialization}
              </Typography>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <Typography variant="small" className="font-semibold">
                Education:
              </Typography>
              <Typography variant="small" color="gray">
                {doctor.education}
              </Typography>
            </div>

            <div>
              <Typography variant="small" className="font-semibold">
                Experience:
              </Typography>
              <Typography variant="small" color="gray">
                {doctor.experience_years} years
              </Typography>
            </div>

            <div>
              <Typography variant="small" className="font-semibold">
                Email:
              </Typography>
              <Typography variant="small" color="gray">
                {doctor.user.email_id}
              </Typography>
            </div>

            <div>
              <Typography variant="small" className="font-semibold">
                Phone:
              </Typography>
              <Typography variant="small" color="gray">
                {doctor.user.phone_no}
              </Typography>
            </div>

            {doctor.bio && (
              <div>
                <Typography variant="small" className="font-semibold">
                  About:
                </Typography>
                <Typography variant="small" color="gray">
                  {doctor.bio}
                </Typography>
              </div>
            )}
          </div>
        </div>
      ),
    });
  };

  const handleStep2Submit = async () => {
    if (selectedDoctors.length === 0) {
      alert("Please select at least one doctor");
      return;
    }

    try {
      setLoading(true);
      await assignDoctorsToPatient(patientId, selectedDoctors);

      // Store token and navigate to dashboard
      addTokenToLocalStorage(token);
      alert("Registration completed successfully!");
      navigate("/dashboard");
      window.location.reload();
    } catch (error: any) {
      console.error("Error assigning doctors:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="m-8 flex">
      {/* Left side image */}
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
          alt="Pattern background"
          title="Pattern background"
        />
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            {step === 1 ? "Join Us Today" : "Select Your Doctors"}
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            {step === 1
              ? "Fill in your details to register."
              : "Choose the doctors you'd like to consult with."}
          </Typography>
        </div>

        {step === 1 ? (
          <form
            className="mt-8 mb-2 mx-auto w-full max-w-screen-lg lg:w-full px-8"
            onSubmit={handleStep1Submit}
          >
            <div className="flex flex-col gap-5">
              {/* Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    size="lg"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    crossOrigin={undefined}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    size="lg"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@mail.com"
                    crossOrigin={undefined}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Password + Repeat Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-gray-700 mb-1">
                    Password
                  </label>
                  <Input
                    type="password"
                    size="lg"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    crossOrigin={undefined}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-gray-700 mb-1">
                    Repeat Password
                  </label>
                  <Input
                    type="password"
                    size="lg"
                    name="repeatPassword"
                    value={formData.repeatPassword}
                    onChange={handleChange}
                    placeholder="********"
                    crossOrigin={undefined}
                  />
                  {errors.repeatPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.repeatPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone + DOB */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    size="lg"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    crossOrigin={undefined}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    size="lg"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    crossOrigin={undefined}
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-blue-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full text-blue-gray-700 focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  aria-label="Gender"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <Checkbox
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                crossOrigin={undefined}
                label={
                  <Typography
                    variant="small"
                    color="gray"
                    className="flex items-center justify-start font-medium"
                  >
                    I agree to the&nbsp;
                    <a
                      href="#"
                      className="font-normal text-black transition-colors hover:text-gray-900 underline"
                    >
                      Terms and Conditions
                    </a>
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />
              {errors.agree && (
                <p className="text-red-500 text-sm mt-1">{errors.agree}</p>
              )}
            </div>

            <Button className="mt-6" fullWidth type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Continue to Doctor Selection"}
            </Button>

            <Typography
              variant="paragraph"
              className="text-center text-blue-gray-500 font-medium mt-4"
            >
              Already have an account?
              <Link to="/auth/login" className="text-gray-900 ml-1">
                Sign in
              </Link>
            </Typography>
          </form>
        ) : (
          <div className="mt-8 mb-2 mx-auto w-full max-w-screen-lg px-4">
            {loading ? (
              <div className="text-center py-8">
                <Typography>Loading doctors...</Typography>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
                  {doctors.map((doctor) => (
                    <Card
                      key={doctor.id}
                      className={`cursor-pointer transition-all shadow-none border ${
                        selectedDoctors.includes(doctor.id)
                          ? " bg-blue-50"
                          : "hover:shadow-lg"
                      }`}
                    >
                      <CardBody>
                        <div className="flex items-start gap-3">
                          <Avatar
                            src={`https://ui-avatars.com/api/?name=${doctor.user.name}&background=random`}
                            alt={doctor.user.name}
                            size="lg"
                          />
                          <div className="flex-1">
                            <Typography variant="h6" className="mb-1">
                              Dr. {doctor.user.name}
                            </Typography>
                            <Typography
                              variant="small"
                              color="gray"
                              className="mb-1"
                            >
                              {doctor.specialization}
                            </Typography>
                            <Typography variant="small" color="gray">
                              {doctor.experience_years} years experience
                            </Typography>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button
                            size="sm"
                            variant="outlined"
                            fullWidth
                            onClick={() => showDoctorDetails(doctor)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            color={
                              selectedDoctors.includes(doctor.id)
                                ? "red"
                                : "blue"
                            }
                            fullWidth
                            onClick={() => toggleDoctorSelection(doctor.id)}
                          >
                            {selectedDoctors.includes(doctor.id)
                              ? "Remove"
                              : "Select"}
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>

                <div className="flex gap-4 sticky bottom-0 bg-white py-3">
                  <Button
                    variant="outlined"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button
                    fullWidth
                    onClick={handleStep2Submit}
                    disabled={loading || selectedDoctors.length === 0}
                  >
                    {loading
                      ? "Completing Registration..."
                      : `Complete Registration (${
                          selectedDoctors.length
                        } doctor${
                          selectedDoctors.length !== 1 ? "s" : ""
                        } selected)`}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default SignUpPatient;
