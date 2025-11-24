import Api from "@/utils/Axios";

export const getAdminDashboardData = async () => {
    try {
        const response = await Api.get('/admin/dashboard-data');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error fetching admin dashboard data");
    }
};
