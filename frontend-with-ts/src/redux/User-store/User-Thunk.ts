import authHeader from "../../utils/Auth-Header";
import customFetch from "../../utils/Axios";
import errorMessage from "../../utils/Error-Message";
import { addTokenToLocalStorage } from "../../utils/Local-Storage";

import { clearUserToken } from "./User-Slice";

interface FormInput {
  username?: string;
  password?: string;
  [key: string]: unknown;
}

interface ThunkAPI {
  dispatch: (action: unknown) => void;
  rejectWithValue: (value: { errorStatusCode: number; message: string }) => unknown;
}

export const loginUserThunk = async (
  _url: string,
  formInput: FormInput,
  thunkAPI: ThunkAPI
): Promise<string> => {
  try {
    const response = await customFetch.post("/login", formInput, authHeader());
    setTimeout(() => {
      alert(`Login Successfull with username : ${response.data.msg.username}`);
    }, 250);

    addTokenToLocalStorage(response.data.msg.token);
    return response.data.msg.token;
  } catch (error) {
    const { errorStatusCode, message } = errorMessage(error);
    alert(message);
    return thunkAPI.rejectWithValue({ errorStatusCode, message }) as never;
  }
};

export const registerUserThunk = async (
  _url: string,
  formInput: FormInput,
  thunkAPI: ThunkAPI
): Promise<string> => {
  try {
    const response = await customFetch.post(
      "/register",
      formInput,
      authHeader()
    );

    setTimeout(() => {
      alert(
        `registration Successfull with username : ${response.data.msg.username}`
      );
    }, 250);
    addTokenToLocalStorage(response.data.msg.token);

    return response.data.msg.token;
  } catch (error) {
    const { errorStatusCode, message } = errorMessage(error);
    alert(message);
    return thunkAPI.rejectWithValue({ errorStatusCode, message }) as never;
  }
};

export const logoutUserThunk = async (
  _message: string,
  thunkAPI: ThunkAPI
): Promise<void> => {
  try {
    thunkAPI.dispatch(clearUserToken());

    return Promise.resolve();
  } catch (error) {
    return Promise.reject();
  }
};

