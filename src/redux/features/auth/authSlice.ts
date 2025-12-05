import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
//   refreshToken: string | null;
//   expiresIn: number | null;
}

// Helper function to safely get items from localStorage
const getItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
};

// Load initial state from localStorage
const loadInitialState = (): AuthState => {
  const accessToken = getItem('accessToken');
//   const refreshToken = getItem('refreshToken');
//   const expiresIn = getItem('expiresIn');
  
  return {
    accessToken,
    // refreshToken,
    // expiresIn: expiresIn ? parseInt(expiresIn, 10) : null,
  };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        // refreshToken?: string;
        // expiresIn?: number;
      }>
    ) => {
    //   const { accessToken, refreshToken, expiresIn } = action.payload;
      const { accessToken } = action.payload;
      
      state.accessToken = accessToken;
      
    //   if (refreshToken !== undefined) {
    //     state.refreshToken = refreshToken;
    //   }
      
    //   if (expiresIn !== undefined) {
    //     state.expiresIn = expiresIn;
    //   }

      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('accessToken', accessToken);
        //   if (refreshToken) {
        //     localStorage.setItem('refreshToken', refreshToken);
        //   }
        //   if (expiresIn) {
        //     localStorage.setItem('expiresIn', expiresIn.toString());
        //   }
        } catch (error) {
          // Silent fail for localStorage errors
        }
      }
    },

    logout: (state) => {
      state.accessToken = null;
    //   state.refreshToken = null;
    //   state.expiresIn = null;

      // Clear localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('accessToken');
        //   localStorage.removeItem('refreshToken');
        //   localStorage.removeItem('expiresIn');
        } catch (error) {
          // Silent fail for localStorage errors
        }
      }
    },

    clearTokens: (state) => {
      state.accessToken = null;
    //   state.refreshToken = null;
    //   state.expiresIn = null;
    },
  },
});

export const { setCredentials, logout, clearTokens } = authSlice.actions;
export default authSlice.reducer;