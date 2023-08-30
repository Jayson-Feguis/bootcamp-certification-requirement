import { COLOR } from "@/helpers/constants";
import { Box, Typography, Container, IconButton } from "@mui/material";
import React, { FC } from "react";
import logo from "@/assets/images/logo.png";
import Image from "next/image";
import { AiFillGithub } from "react-icons/ai";
import { BiLogoLinkedin } from "react-icons/bi";

const social = [
  {
    title: "Github",
    link: "https://github.com/Jayson-Feguis",
    icon: <AiFillGithub />,
  },
  {
    title: "LinkedIn",
    link: "https://www.linkedin.com/in/feguis-jayson-465a88232/",
    icon: <BiLogoLinkedin />,
  },
];

const Footer: FC = () => {
  return (
    <Box
      className="w-full !flex !justify-center !py-10 !text-white"
      sx={{ background: COLOR.SECONDARY }}
    >
      <Container
        maxWidth="md"
        className="!flex !justify-center !items-center !flex-col"
      >
        <Box className="!flex !gap-2">
          <Image src={logo} alt="JSON Logo" width={50} height={50} />
          <Box className="!flex !gap-2 !justify-center !items-center">
            <Typography variant="body2">Developed by:</Typography>
            <Typography variant="body1">JSON</Typography>
          </Box>
        </Box>
        <Box className="!flex !gap-1">
          {social.map((i) => (
            <IconButton
              key={i.title}
              component="a"
              href={i.link}
              target="_blank"
              className="!text-white"
              size="small"
            >
              {i.icon}
            </IconButton>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
