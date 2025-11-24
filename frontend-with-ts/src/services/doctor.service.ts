import Api from "@/utils/Axios";

export const getDoctorDashboardData = async () => {
    try {
        const response = await Api.get('/doctors/dashboard-data');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error fetching doctor dashboard data");
    }
};

export const addDoctor = async (doctorData: any) => {
    try {
        const response = await Api.post('/doctors/register', doctorData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error registering doctor");
    }
};
