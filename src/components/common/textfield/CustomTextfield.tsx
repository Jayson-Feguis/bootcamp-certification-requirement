import React, { FC } from "react";
import { InputBase, Box, Typography, InputBaseProps } from "@mui/material";
import { COLOR } from "@/helpers/constants";
import { toSentenceCase } from "@/helpers/utils";

const CustomTextfield: FC<InputBaseProps> = (props) => {
  return (
    <Box className="w-full">
      <Typography variant="body1" className="!text-white">
        {toSentenceCase(props?.name?.split(".")[0].replaceAll("_", " ") || "")}
      </Typography>
      <InputBase
        {...props}
        className="!text-white px-3 py-1 rounded-md w-full"
        sx={{ background: COLOR.PRIMARY }}
      />
    </Box>
  );
};

export default CustomTextfield;
