import Api from "@/utils/Axios";

export const registerPatient = async (patientData: any) => {
    try {
        const response = await Api.post('/signup', patientData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error registering patient");
    }
};

export const getAllDoctors = async () => {
    try {
        const response = await Api.get('/doctors');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error fetching doctors");
    }
};

export const assignDoctorsToPatient = async (patientId: string, doctorIds: string[]) => {
    try {
        const response = await Api.post('/assign-doctors', {
            patient_id: patientId,
            doctor_ids: doctorIds
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error assigning doctors");
    }
};

export const getPatientDashboardData = async () => {
    try {
        const response = await Api.get('/patient/dashboard-data');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error fetching patient dashboard data");
    }
};
