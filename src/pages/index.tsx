import { useEffect, useMemo, useState } from "react";
import {
  CustomModal,
  CustomSelectWalletButton,
  TitleHeader,
} from "@/components";
import { COLOR, FONT, GAME } from "@/helpers/constants";
import { useLeaderboard, useOpenElement, useTileGame } from "@/hooks";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import _ from "lodash";
import { toSentenceCase } from "@/helpers/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { RiSaveLine } from "react-icons/ri";
import { TbReload } from "react-icons/tb";

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
    reset,
  } = useTileGame();
  const {
    initializeUser,
    addLeaderboard,
    isLoading: isLeaderboardLoading,
  } = useLeaderboard();
  const { open, onClose, onOpen } = useOpenElement();
  const { connected, publicKey } = useWallet();
  const [isSaved, setIsSaved] = useState(false);

  const tileStyle = useMemo(
    () =>
      _.size(tiles) === 16
        ? { width: "500px", padding: "0.75rem", fontSize: "40px", grid: 3 }
        : _.size(tiles) === 36 // 6x6
        ? { width: "500px", padding: "0.75rem", fontSize: "30px", grid: 2 }
        : _.size(tiles) === 64 // 8x8
        ? { width: "600px", padding: "0.25rem", fontSize: "30px", grid: 12 / 8 }
        : { width: "auto", padding: "0.50rem", fontSize: "24px", grid: 1 },
    [tiles]
  );

  useEffect(() => {
    if (isWinner && !isStarted) onOpen();
    if (!connected && !publicKey) reset();
  }, [isWinner, isStarted, connected, publicKey]);

  const renderPlay = () => (
    <Box
      className="flex justify-center items-center text-white w-[500px] h-[500px] bg-opacity-70 rounded-lg gap-10"
      sx={{
        background: `${COLOR.SECONDARY} !important`,
        flexDirection: publicKey ? "column" : "column-reverse",
      }}
    >
      <Typography variant={publicKey ? "h4" : "body2"}>
        {publicKey
          ? "Start Game"
          : "Please connect your wallet to play the game!"}
      </Typography>
      {!connected && !publicKey ? <CustomSelectWalletButton /> : renderModes()}
    </Box>
  );

  const renderModes = () =>
    !isStarted && (
      <Box className="flex justify-center items-center flex-col gap-3">
        <Typography variant="h6">Choose Mode</Typography>
        <Box className="flex gap-2">
          {GAME.find((i: any) => _.isEqual(i.TITLE, "tile"))?.MODES.map((i) => (
            <Button
              key={i}
              variant="contained"
              onClick={async () => {
                const isSuccess = await initializeUser();
                if (isSuccess) {
                  start(i);
                  setIsSaved(false);
                }
              }}
              color="primary"
              sx={{
                background: `${COLOR.PRIMARY} !important`,
                fontFamily: FONT.BARRIECITO,
                fontSize: 20,
              }}
            >
              {isLeaderboardLoading ? (
                <>
                  <CircularProgress size={16} className="mr-3 text-white" /> {i}
                </>
              ) : (
                i
              )}
            </Button>
          ))}
        </Box>
      </Box>
    );

  const renderPlayAgain = () => (
    <Box className="flex justify-center items-center flex-col text-white gap-10 w-full">
      <Box className="flex flex-col text-center">
        <Typography variant="h4" gutterBottom className="font-bold">
          You won!
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: COLOR.YELLOW,
          }}
        >{`You've got ${count.point} Points!`}</Typography>
        <Typography
          variant="caption"
          sx={{
            color: COLOR.WHITE,
          }}
        >{`In just ${count.time} seconds`}</Typography>
      </Box>
      <Box className="flex flex-col gap-2">
        {!isSaved && (
          <Button
            variant="contained"
            onClick={() => onOpen()}
            startIcon={<RiSaveLine />}
            sx={{
              background: `${COLOR.YELLOW} !important`,
              color: `${COLOR.BLACK} !important`,
              fontFamily: FONT.BARRIECITO,
              fontSize: 20,
            }}
          >
            Save Game
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<TbReload />}
          onClick={() => {
            start();
            setIsSaved(false);
          }}
          sx={{
            fontFamily: FONT.BARRIECITO,
            fontSize: 20,
          }}
        >
          Play again
        </Button>
      </Box>
      {renderModes()}
    </Box>
  );

  const renderPoints = () =>
    isStarted && (
      <Grid
        container
        className="flex justify-center"
        sx={{ width: tileStyle.width }}
      >
        {Object.keys(count)?.map(
          (i) =>
            !_.isEqual(i, "game") && (
              <Grid
                item
                key={i.toString() as string}
                className="text-white flex items-end gap-1 justify-center"
                xs={12 / _.size(Object.keys(count))}
              >
                <Typography
                  className="!text-lg"
                  sx={{ fontFamily: FONT.PLAYMEGAMES, color: COLOR.WHITE }}
                >
                  {toSentenceCase(i)}:
                </Typography>
                <Typography
                  className="!text-xl"
                  sx={{
                    fontFamily: FONT.BARRIECITO,
                    color: COLOR.YELLOW,
                    fontWeight: "bold",
                  }}
                >
                  {count[i.toString()]}
                  {`${_.isEqual(i, "time") ? "s" : ""}`}
                </Typography>
              </Grid>
            )
        )}
      </Grid>
    );

  const renderTileGrid = () => (
    <Grid
      container
      className={"relative"}
      sx={{
        width: tileStyle.width,
        minHeight: _.size(tiles) > 0 && isWinner ? "500px" : "0",
      }}
    >
      {_.size(tiles) > 0 && isStarted
        ? tiles?.map((item, index) => (
            <Grid
              key={`${index}-${item}`}
              item
              xs={tileStyle.grid}
              className="aspect-square"
              sx={{
                padding: tileStyle.padding,
              }}
            >
              <Button
                variant="contained"
                onClick={() => onClickTile(index)}
                className="aspect-square rounded-lg w-full"
                sx={{
                  background: `${COLOR.TERTIARY} !important`,
                  fontSize: tileStyle.fontSize,
                }}
              >
                {clickedCorrectTiles.includes(index) ||
                clickedTiles.includes(index)
                  ? item
                  : ""}
              </Button>
            </Grid>
          ))
        : isStarted && "No Available Tile"}
      {isWinner && !isStarted && (
        <Box
          className={
            "absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-60 rounded-lg"
          }
        >
          {renderPlayAgain()}
        </Box>
      )}
    </Grid>
  );

  return (
    <>
      <Box className="flex flex-col items-center min-h-[calc(100vh-60px)] gap-10">
        <TitleHeader title="TILE Game" />
        {!isWinner && !isStarted && renderPlay()}
        {/* ------------------------------ PLAYER POINTS ----------------------------- */}
        {renderPoints()}
        {/* -------------------------------- TILE GRID ------------------------------- */}
        {renderTileGrid()}
      </Box>
      {/* ---------------------------------- MODAL --------------------------------- */}
      {!isSaved && (
        <CustomModal open={open}>
          <Box className="flex justify-center items-center flex-col text-white gap-5">
            <Typography variant="h6">Want to save the game?</Typography>
            <Grid container className="w-full">
              {Object.keys(count)?.map((i) => (
                <Grid
                  item
                  key={i.toString() as string}
                  className="text-white"
                  xs={12}
                >
                  <Grid container className="w-full">
                    <Grid item xs={5} className="text-end">
                      {toSentenceCase(i)}
                    </Grid>
                    <Grid item xs={2} className="text-center">
                      :
                    </Grid>
                    <Grid item xs={5}>
                      {`${
                        typeof count[i.toString()] === "string"
                          ? toSentenceCase(count[i.toString()].toString())
                          : count[i.toString()]
                      }${_.isEqual(i, "time") ? "s" : ""}`}
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Box>
              <Typography variant="caption" className="italic opacity-70">
                Note: Save the game if you want it to be displayed on the
                leaderboard
              </Typography>
            </Box>
            <Box className="flex w-[60%] justify-end gap-3 self-end">
              <Button
                variant="text"
                onClick={() => onClose()}
                sx={{
                  color: COLOR.WHITE,
                }}
                disabled={isLeaderboardLoading}
              >
                No
              </Button>
              <Button
                variant="contained"
                onClick={async () => {
                  const isSuccess = await addLeaderboard(
                    count.game,
                    count.mode,
                    count.point,
                    count.time,
                    count.guess
                  );

                  if (isSuccess) {
                    onClose();
                    setIsSaved(true);
                  }
                }}
                className="flex-1"
                disabled={isLeaderboardLoading}
                sx={{
                  background: `${COLOR.YELLOW} !important`,
                  color: `${COLOR.BLACK} !important`,
                }}
              >
                {isLeaderboardLoading ? (
                  <>
                    <CircularProgress size={16} className="mr-3" /> Save
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </Box>
          </Box>
        </CustomModal>
      )}
    </>
  );
}
