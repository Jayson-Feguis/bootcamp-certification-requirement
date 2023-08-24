import { useSnackbarContext } from "@/context";
import React, { FC } from "react";
import { Snackbar, Alert as MuiAlert, AlertProps } from "@mui/material";
import useSnackbar from "@/hooks/useSnackbar";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomSnackbar: FC = () => {
  const { snackbar } = useSnackbarContext();
  const { onClose } = useSnackbar();

  return (
    <Snackbar
      open={snackbar.isShow}
      autoHideDuration={6000}
      message={snackbar.content}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={snackbar.type} sx={{ width: "100%" }}>
        {snackbar.content}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
