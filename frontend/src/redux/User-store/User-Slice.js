import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addTokenToLocalStorage,
  getTokenFromLocalStorage,
  removeTokenFromLocalStorage,
} from "../../utils/Local-Storage";
import {
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
} from "./User-Thunk";

const initialState = {
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
  (formInput, thunkAPI) => {
    return loginUserThunk("/login", formInput, thunkAPI);
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  (formInput, thunkAPI) => {
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

    handleFormInput: (state, { payload: { name, value } }) => {
      state[name] = value;
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
      (state, { payload: { errorStatusCode, message } }) => {
        removeTokenFromLocalStorage();
        state.isLoading = false;
        state.tokenLog = "";
        state.errorMessage = message;
        state.errorStatusCode = errorStatusCode;
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
      (state, { payload: { errorStatusCode, message } }) => {
        removeTokenFromLocalStorage();
        state.isLoading = false;
        state.tokenLog = "";
        state.errorMessage = message;
        state.errorStatusCode = errorStatusCode;
      }
    );
    builder.addCase(logoutUser.fulfilled, (state) => {
      alert("Logging Out.......");
    });
  },
});

export const { clearUserToken, handleFormInput, clearUserFormInput } =
  userSlice.actions;
export default userSlice.reducer;
