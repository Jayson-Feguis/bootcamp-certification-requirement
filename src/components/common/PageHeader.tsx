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
  const [isSticky, setIsSticky] = useState(true);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
  }, [isSticky]);

  function onScroll() {
    if (window.scrollY > 80) {
      setIsSticky(false);
    } else if (window.scrollY <= 40) {
      setIsSticky(true);
    }
  }

  return (
    <AnimatePresence>
      <Box
        component={motion.div}
        className={
          isSticky
            ? "px-16 py-10 rounded-md mb-10 flex justify-between items-center sticky top-[48px] z-50"
            : "p-3 w-full flex justify-between items-center fixed left-0 top-[48px] z-50"
        }
        sx={{
          background: COLOR.SECONDARY,
          border: `1px solid ${COLOR.TERTIARY}`,
        }}
      >
        <Box>
          <Typography
            variant={isSticky ? "h3" : "h6"}
            component="p"
            className="!text-white"
          >
            {title}
          </Typography>
          {isSticky && (
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
          )}
        </Box>
        {isSticky && <Box>{action}</Box>}
      </Box>
    </AnimatePresence>
  );
};

export default PageHeader;
