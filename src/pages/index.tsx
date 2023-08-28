import { useEffect } from "react";
import { CustomModal } from "@/components";
import { COLOR } from "@/helpers/constants";
import { useLeaderboard, useOpenElement, useTileGame } from "@/hooks";
import { Box, Button, Grid, Typography } from "@mui/material";
import _ from "lodash";
import { ICount } from "@/hooks/useTileGame";

export default function Home() {
  const {
    tiles,
    start,
    onClickTile,
    clickedTiles,
    clickedCorrectTiles,
    isWinner,
    isStarted,
    count,
    getElapsedRunningTime,
  } = useTileGame();
  const { initialized, initializeUser, getLeaderboard, addLeaderboard } =
    useLeaderboard();

  const renderPlay = () => (
    <Box
      className="flex justify-center items-center flex-col text-white w-[500px] h-[500px] bg-opacity-70 rounded-lg gap-3"
      sx={{
        background: `${COLOR.SECONDARY} !important`,
      }}
    >
      <Typography variant="h4">You wanna play?</Typography>
      {renderModes()}
    </Box>
  );

  const renderModes = () =>
    !isStarted && (
      <Box className="flex justify-center items-center flex-col">
        <Typography variant="h6">Choose Mode</Typography>
        <Box className="flex gap-2">
          <Button variant="contained" onClick={() => start("4x4")}>
            4x4
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => start("6x6")}
          >
            6x6
          </Button>
        </Box>
      </Box>
    );

  const renderPlayAgain = () => (
    <Box className="flex justify-center items-center flex-col text-white gap-5">
      <Typography variant="h4">You won!</Typography>
      <Button variant="contained" color="primary" onClick={() => start()}>
        Play again
      </Button>
      {renderModes()}
    </Box>
  );

  const renderPoints = () => (
    <Grid container className={"w-[500px] flex justify-center"}>
      {Object.keys(count)?.map((i) => (
        <Grid
          item
          key={i.toString() as string}
          className="text-white"
          xs={2}
        >{`${i}: ${count[i.toString()]}${
          _.isEqual(i, "time") ? "s" : ""
        }`}</Grid>
      ))}
    </Grid>
  );

  return (
    <>
      <Box className="flex flex-col items-center min-h-[calc(100vh-60px)] justify-center">
        <Button
          variant="contained"
          onClick={() => getLeaderboard()}
          sx={{
            background: `${COLOR.TERTIARY} !important`,
          }}
        >
          Fetch Leaderboard
        </Button>
        {!initialized && (
          <Button
            variant="contained"
            onClick={() => initializeUser()}
            sx={{
              background: `${COLOR.TERTIARY} !important`,
            }}
          >
            Initialized
          </Button>
        )}

        {isWinner && !isStarted && (
          <Button
            variant="contained"
            onClick={() =>
              addLeaderboard(
                count.game,
                count.mode,
                count.point,
                count.time,
                count.guess
              )
            }
            sx={{
              background: `${COLOR.TERTIARY} !important`,
            }}
          >
            Add Leaderboard
          </Button>
        )}

        {!isWinner && !isStarted && renderPlay()}
        {renderPoints()}
        <Grid container className="w-[500px] relative">
          {tiles?.map((item, index) => (
            <Grid
              key={`${index}-${item}`}
              item
              xs={_.size(tiles) === 16 ? 3 : _.size(tiles) === 32 ? 2 : 2}
              className="aspect-square !w-[30px] p-3"
            >
              <Button
                variant="contained"
                onClick={() => onClickTile(index)}
                className="aspect-square rounded-lg text-2xl w-full"
                sx={{
                  background: `${COLOR.TERTIARY} !important`,
                }}
              >
                {clickedCorrectTiles.includes(index) ||
                clickedTiles.includes(index)
                  ? item
                  : ""}
              </Button>
            </Grid>
          ))}
          {isWinner && !isStarted && (
            <Box
              className={
                "absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-80 rounded-lg"
              }
            >
              {renderPlayAgain()}
            </Box>
          )}
        </Grid>
      </Box>
      {/* <CustomModal open={open} onClose={onClose}>
        {renderPlayAgain()}
      </CustomModal> */}
    </>
  );
}
