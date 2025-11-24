import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  addTokenToLocalStorage,
  getTokenFromLocalStorage,
  removeTokenFromLocalStorage,
} from "@/utils/Local-Storage";
import {
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
} from "./User-Thunk";

interface UserState {
  tokenLog: string;
  isLoading: boolean;
  loginUsername: string;
  loginPassword: string;
  registerUsername: string;
  registerPassword: string;
  registerResetPassword: string;
  errorMessage: string;
  errorStatusCode: number;
}

interface FormInput {
  username?: string;
  password?: string;
  [key: string]: unknown;
}

const initialState: UserState = {
  tokenLog: getTokenFromLocalStorage(),
  isLoading: false,
  loginUsername: "",
  loginPassword: "",
  registerUsername: "",
  registerPassword: "",
  registerResetPassword: "",
  errorMessage: "",
  errorStatusCode: 0,
};

export const loginUser = createAsyncThunk(
  "user/loginUser",
  (formInput: FormInput, thunkAPI) => {
    return loginUserThunk("/login", formInput, thunkAPI);
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  (formInput: FormInput, thunkAPI) => {
    return registerUserThunk("/register", formInput, thunkAPI);
  }
);

export const logoutUser = createAsyncThunk("user/logoutUser", (_, thunkAPI) => {
  return logoutUserThunk("/logoutUser", thunkAPI);
});

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    clearUserFormInput: (state) => {
      state.loginUsername = "";
      state.loginPassword = "";
      state.registerUsername = "";
      state.registerPassword = "";
      state.registerResetPassword = "";
    },
    clearUserToken: (state) => {
      removeTokenFromLocalStorage();
      state.tokenLog = "";
      state.errorMessage = "";
      state.errorStatusCode = 0;
    },

    handleFormInput: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof UserState; value: string }>
    ) => {
      (state[name] as string) = value;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      removeTokenFromLocalStorage();
    });

    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.errorMessage = "";
      state.errorStatusCode = 0;
      state.isLoading = false;
      state.tokenLog = payload;
      addTokenToLocalStorage(state.tokenLog);
    });

    builder.addCase(
      loginUser.rejected,
      (state, action) => {
        removeTokenFromLocalStorage();
        state.isLoading = false;
        state.tokenLog = "";
        const payload = action.payload as { errorStatusCode: number; message: string } | undefined;
        state.errorMessage = payload?.message || "";
        state.errorStatusCode = payload?.errorStatusCode || 0;
      }
    );
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      removeTokenFromLocalStorage();
    });

    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.tokenLog = payload;
      addTokenToLocalStorage(state.tokenLog);
    });

    builder.addCase(
      registerUser.rejected,
      (state, action) => {
        removeTokenFromLocalStorage();
        state.isLoading = false;
        state.tokenLog = "";
        const payload = action.payload as { errorStatusCode: number; message: string } | undefined;
        state.errorMessage = payload?.message || "";
        state.errorStatusCode = payload?.errorStatusCode || 0;
      }
    );
    builder.addCase(logoutUser.fulfilled, () => {
      alert("Logging Out.......");
    });
  },
});

export const { clearUserToken, handleFormInput, clearUserFormInput } =
  userSlice.actions;
export default userSlice.reducer;

