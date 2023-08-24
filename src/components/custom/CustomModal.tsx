import React, { FC, ReactElement } from "react";
import { Backdrop, Modal, Fade, Box } from "@mui/material";
import { COLOR } from "@/helpers/constants";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactElement;
}

const CustomModal: FC<Props> = ({ children, open, onClose }) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: "calc(100% - 36px)",
              sm: "calc(100% - 48px)",
              md: "auto",
            },
            minWidth: { xs: "90%", md: 400 },
            bgcolor: COLOR.TERTIARY,
            boxShadow: 24,
            p: 4,
          }}
        >
          {children}
        </Box>
      </Fade>
    </Modal>
  );
};

export default CustomModal;
