import React, {
  useState,
  createContext,
  useContext,
  PropsWithChildren,
} from "react";
import type { AlertColor } from "@mui/material";

interface SnackbarState {
  type: AlertColor;
  isShow: boolean;
  content?: string;
}

interface SnackbarContextType {
  snackbar: SnackbarState;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarState>>;
}

const SnackbarContext = createContext<SnackbarContextType | null>(null);

const ContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    type: "info",
    isShow: false,
    content: "",
  });

  return (
    <SnackbarContext.Provider value={{ snackbar, setSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbarContext = () => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error(
      "useSnackbarContext must be used inside the ContextProvider"
    );
  }

  return context;
};

export default ContextProvider;
