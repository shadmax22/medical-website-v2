import Api from "@/utils/Axios";

export const registerPatient = async (patientData: any) => {
  try {
    const response = await Api.post("/signup", patientData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error registering patient"
    );
  }
};

export const getAllDoctors = async () => {
  try {
    const response = await Api.get("/doctors");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching doctors");
  }
};

export const assignDoctorsToPatient = async (
  patientId: string,
  doctorIds: string[]
) => {
  try {
    const response = await Api.post("/assign-doctors", {
      patient_id: patientId,
      doctor_ids: doctorIds,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error assigning doctors");
  }
};

export const getPatientDashboardData = async () => {
  try {
    const response = await Api.get("/patient/dashboard-data");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error fetching patient dashboard data"
    );
  }
};

export const getDoctorPatientsPanel = async () => {
  try {
    const response = await Api.get("/doctor/patients");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error fetching doctor patients"
    );
  }
};

export const getPatientProfile = async (patientId: string) => {
  try {
    const response = await Api.get(`/patient/${patientId}/profile`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error fetching patient profile"
    );
  }
};

export const postPatientConversation = async (
  patientId: string,
  payload: { message: string }
) => {
  try {
    const response = await Api.post(
      `/patient/${patientId}/conversations`,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error sending conversation"
    );
  }
};

export const createPatientGoal = async (
  patientId: string,
  payload: { target_type: string; goal_target_value: string; frequency: number }
) => {
  try {
    const response = await Api.post(`/patient/${patientId}/goals`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error creating goal");
  }
};

export const createPatientPrescription = async (
  patientId: string,
  payload: {
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
  }
) => {
  try {
    const response = await Api.post(
      `/patient/${patientId}/prescriptions`,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error creating prescription"
    );
  }
};

export const createGoalTrackingEntry = async (
  goalId: string,
  payload: { value?: string }
) => {
  try {
    const response = await Api.post(`/patient/goals/${goalId}/track`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error logging goal progress"
    );
  }
};
