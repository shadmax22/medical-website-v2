import { addDoctor } from "@/services/doctor.service";
import { VModal } from "@/utils/VModal";
import { Controller, useForm } from "react-hook-form";

export async function AddDoctorModal() {
  await VModal({
    title: "Add Doctor",
    body: (resolver) => <AddDoctor resolver={resolver}></AddDoctor>,
    size: "fluid",
    footer: () => <></>,
  });
}

function AddDoctor({ resolver }: { resolver: any }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone_no: "",
      dob: "",
      specialization: "",
      medical_license: "",
      education: "",
      experience_years: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        name: data.name,
        email_id: data.email,
        password: data.password,
        phone_no: data.phone_no,
        dob: data.dob,
        specialization: data.specialization,
        medical_license: data.medical_license,
        education: data.education,
        experience_years: Number(data.experience_years),
      };

      await addDoctor(payload);
      alert("Doctor Added Successfully!");
      resolver();
      window.location.reload(); // Reload to show new doctor in list
    } catch (error: any) {
      console.error("Error adding doctor:", error);
      alert(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 w-[40vw] max-h-[400px] overflow-scroll"
    >
      {/* ------------------------- NAME -------------------------- */}
      <div>
        <label className="block mb-1 font-medium">Full Name</label>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full border px-3 py-2 rounded-md"
              placeholder="Enter doctor's full name"
            />
          )}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* ------------------------- EMAIL -------------------------- */}
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter valid email",
            },
          }}
          render={({ field }) => (
            <input
              {...field}
              type="email"
              className="w-full border px-3 py-2 rounded-md"
              placeholder="doctor@example.com"
            />
          )}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* ------------------------- PASSWORD -------------------------- */}
      <div>
        <label className="block mb-1 font-medium">Password</label>
        <Controller
          name="password"
          control={control}
          rules={{ required: "Password is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="password"
              className="w-full border px-3 py-2 rounded-md"
              placeholder="Create password"
            />
          )}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* ------------------------- PHONE -------------------------- */}
      <div>
        <label className="block mb-1 font-medium">Phone Number</label>
        <Controller
          name="phone_no"
          control={control}
          rules={{ required: "Phone number is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full border px-3 py-2 rounded-md"
              placeholder="+91 XXXXX XXXXX"
            />
          )}
        />
        {errors.phone_no && (
          <p className="text-red-500 text-sm">{errors.phone_no.message}</p>
        )}
      </div>

      {/* ------------------------- DOB -------------------------- */}
      <div>
        <label className="block mb-1 font-medium">Date of Birth</label>
        <Controller
          name="dob"
          control={control}
          rules={{ required: "DOB is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="date"
              className="w-full border px-3 py-2 rounded-md"
            />
          )}
        />
        {errors.dob && (
          <p className="text-red-500 text-sm">{errors.dob.message}</p>
        )}
      </div>

      {/* ------------------------- SPECIALIZATION -------------------------- */}
      <div>
        <label className="block mb-1 font-medium">Specialization</label>
        <Controller
          name="specialization"
          control={control}
          rules={{ required: "Specialization is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="Cardiologist, Orthopedic, etc."
              className="w-full border px-3 py-2 rounded-md"
            />
          )}
        />
        {errors.specialization && (
          <p className="text-red-500 text-sm">
            {errors.specialization.message}
          </p>
        )}
      </div>

      {/* ------------------------- MEDICAL LICENSE -------------------------- */}
      <div>
        <label className="block mb-1 font-medium">Medical License</label>
        <Controller
          name="medical_license"
          control={control}
          rules={{ required: "Medical License is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="License Number"
              className="w-full border px-3 py-2 rounded-md"
            />
          )}
        />
        {errors.medical_license && (
          <p className="text-red-500 text-sm">
            {errors.medical_license.message}
          </p>
        )}
      </div>

      {/* ------------------------- EDUCATION -------------------------- */}
      <div>
        <label className="block mb-1 font-medium">Education</label>
        <Controller
          name="education"
          control={control}
          rules={{ required: "Education is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="MBBS, MD, etc."
              className="w-full border px-3 py-2 rounded-md"
            />
          )}
        />
        {errors.education && (
          <p className="text-red-500 text-sm">{errors.education.message}</p>
        )}
      </div>

      {/* ------------------------- EXPERIENCE -------------------------- */}
      <div>
        <label className="block mb-1 font-medium">Experience (Years)</label>
        <Controller
          name="experience_years"
          control={control}
          rules={{ required: "Experience is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              placeholder="5"
              className="w-full border px-3 py-2 rounded-md"
            />
          )}
        />
        {errors.experience_years && (
          <p className="text-red-500 text-sm">
            {errors.experience_years.message}
          </p>
        )}
      </div>

      {/* ------------------------- SUBMIT BUTTON -------------------------- */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition sticky bottom-0"
      >
        Add Doctor
      </button>
    </form>
  );
}
