"use client";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { COLOR } from "@/helpers/constants";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  title: String;
  description: String;
  action?: ReactNode;
}

const PageHeader: FC<Props> = ({ title, description, action }) => {
  return (
    <AnimatePresence>
      <Box
        component={motion.div}
        className="px-16 py-10 rounded-md mb-10 flex justify-between items-center"
        sx={{
          background: COLOR.SECONDARY,
          border: `1px solid ${COLOR.TERTIARY}`,
        }}
      >
        <Box>
          <Typography variant="h3" component="p" className="!text-white">
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              color: COLOR.WHITE,
              opacity: 0.7,
            }}
          >
            {description}
          </Typography>
        </Box>
        <Box>{action}</Box>
      </Box>
    </AnimatePresence>
  );
};

export default PageHeader;
