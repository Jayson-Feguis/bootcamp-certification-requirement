import { COLOR } from "@/helpers/constants";
import { Typography } from "@mui/material";
import React, { FC } from "react";
import localFont from "next/font/local";

const PLAYMEGAMES = localFont({
  src: "../../../assets/fonts/PlaymegamesReguler-2OOee.ttf",
});

const TitleHeader: FC<{ title: string }> = ({ title }) => {
  return (
    <Typography
      variant="h1"
      sx={{
        ...PLAYMEGAMES.style,
        color: COLOR.YELLOW,
        textAlign: "center",
        textShadow:
          "0px 0px 0 rgb(223,161,0), -1px 1px 0 rgb(191,129,0),-2px 2px 0 rgb(159,97,0),-3px 3px 0 rgb(127,65,0),-4px 4px 0 rgb(95,33,0),-5px 5px  0 rgb(63,1,0),-6px 6px 5px rgba(0,0,0,0.47),-6px 6px 1px rgba(0,0,0,0.5),0px 0px 5px rgba(0,0,0,.2) !important",
      }}
    >
      {title}
    </Typography>
  );
};

export default TitleHeader;
