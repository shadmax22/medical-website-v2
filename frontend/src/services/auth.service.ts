import { UserState } from "@/state/UserState";
import Api from "@/utils/Axios";
import { addTokenToLocalStorage, getTokenFromLocalStorage } from "@/utils/Local-Storage";

export const loginService = async (email_id: string, password: string) => {
    try {

        const response = await Api.post('/login', {
            email_id,
            password
        });
        if (response.data) {
            addTokenToLocalStorage(response.data.token);
            const userState = UserState.use;

            userState.upsert((pv) => {
                pv.user_data = {
                    id: response.data.data.id,
                    name: response.data.data.name,
                    email: response.data.data.email_id,
                    role: response.data.data.role,
                };
            });
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "An error occurred during login. Please try again.";
        throw new Error(errorMessage);
    }
};

export const autoLoginService = async () => {
    try {
        if (!getTokenFromLocalStorage()) throw new Error("No token found");

        const response = await Api.get('/user');
        if (response.data) {
            const userState = UserState.use;
            userState.upsert((pv) => {
                pv.user_data = {
                    id: response.data.data.id,
                    name: response.data.data.name,
                    email: response.data.data.email_id,
                    role: response.data.data.role,
                };
            });
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "An error occurred during auto login. Please try again.";
        throw new Error(errorMessage);
    }
};
