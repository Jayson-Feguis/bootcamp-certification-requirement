import { useDeferredValue } from "react";
import { TitleHeader } from "@/components";
import { useLeaderboard, useMetaflex, useOpenElement } from "@/hooks";
import { Button, Grid, Box, Typography, IconButton } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import useJsonStore from "@/zustand/store";
import _ from "lodash";
import { shortenAddress } from "@/helpers/utils";
import { COLOR, FONT } from "@/helpers/constants";

export default function Leaderboard() {
  const { leaderboard } = useJsonStore();
  const defferedLeaderboard = useDeferredValue(leaderboard);

  const gridItemStyle = "flex items-center";

  console.log(defferedLeaderboard);

  return (
    <Box className="flex flex-col items-center min-h-[calc(100vh-60px)] justify-center gap-10">
      <TitleHeader title="Leaderboard" />
      <Grid
        container
        rowGap={3}
        className="max-h-[calc(100vh-300px)] overflow-auto relative "
      >
        <Grid item xs={12} className="sticky top-0 z-10">
          <Grid
            container
            className="w-full flex justify-center text-white p-5 rounded-xl px-16"
            sx={{
              background: COLOR.TERTIARY,
              boxShadow: "0px 12px 22px -6px rgba(0,0,0,0.58)",
              WebkitBoxShadow: "0px 12px 22px -6px rgba(0,0,0,0.58)",
              MozBoxShadow: "0px 12px 22px -6px rgba(0,0,0,0.58)",
            }}
          >
            <Grid item xs={1} className={gridItemStyle}>
              Rank
            </Grid>
            <Grid item xs={5} className={gridItemStyle}>
              User
            </Grid>
            <Grid item xs={1} className={gridItemStyle}>
              Guess
            </Grid>
            <Grid item xs={1} className={gridItemStyle}>
              Time (s)
            </Grid>
            <Grid item xs={1} className={gridItemStyle}>
              Points
            </Grid>
          </Grid>
        </Grid>
        {_.size(defferedLeaderboard) > 0
          ? defferedLeaderboard.info?.map((i, idx) => (
              <Grid item xs={12} key={`${idx}-${i.user}`} className="px-10">
                <Grid
                  container
                  className="w-full flex justify-center text-white p-5 rounded-xl"
                  sx={{
                    background: COLOR.SECONDARY,
                    border: `1px solid ${COLOR.SECONDARY}`,
                    transition: "all 0.2s ease",
                    opacity: 1,
                    ":hover": {
                      border: `1px solid ${COLOR.TERTIARY}`,
                      opacity: 0.9,
                      zIndex: 1,
                    },
                  }}
                >
                  <Grid item xs={1} className={gridItemStyle}>
                    <Box
                      className="flex rounded-full aspect-square w-10 justify-center items-center"
                      sx={{
                        background: COLOR.YELLOW,
                        fontFamily: FONT.PLAYMEGAMES,
                        color: COLOR.BLACK,
                      }}
                    >
                      {i.rank}
                    </Box>
                  </Grid>
                  <Grid item xs={5} className={gridItemStyle}>
                    <Typography className="truncate">
                      {shortenAddress(i.user)}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} className={gridItemStyle}>
                    <Typography>{i.guess}</Typography>
                  </Grid>
                  <Grid item xs={1} className={gridItemStyle}>
                    <Typography>{i.time}</Typography>
                  </Grid>
                  <Grid item xs={1} className={gridItemStyle}>
                    <Typography>{i.point}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))
          : null}
      </Grid>
    </Box>
  );
}
