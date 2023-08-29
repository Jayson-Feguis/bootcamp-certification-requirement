import React, { useCallback, useState, useEffect, useRef } from "react";
import _ from "lodash";
import { useTimer } from "react-use-precision-timer";
import tileArray from "@/assets/json/tile.json";

export interface ICount {
  game: String;
  mode: String;
  guess: number;
  point: number;
  time: number;
  [key: string]: String | number; // Index signature
}

function useTileGame() {
  // 16 = 4 x 4
  // 36 = 6 x 6
  const [mode, setMode] = useState<String>("4x4");
  const [tiles, setTiles] = useState<String[]>([]);
  const [isStarted, setIsStarted] = useState<Boolean>(false);
  const [isWinner, setIsWinner] = useState<Boolean>(false);

  const pointPerGuess = 10;

  const [clickedTiles, setClickedTiles] = useState<Number[]>([]); // User guess (max length of 2 or [guess1, guess2])
  const [count, setCount] = useState<ICount>({
    game: "tile",
    mode: "4x4",
    guess: 0,
    point: 0,
    time: 0,
  });
  const [clickedCorrectTiles, setClickedCorrectTiles] = useState<Number[]>([]);
  const [canClick, setCanClick] = useState(true);

  // timer
  const {
    getElapsedRunningTime,
    start: startTimer,
    pause: pauseTimer,
    stop: stopTimer,
  } = useTimer({
    delay: 1000,
    runOnce: false,
    fireOnStart: false,
    startImmediately: false,
    speedMultiplier: 1,
  });

  let timer: any = useRef(null);

  useEffect(() => {
    if (!(getElapsedRunningTime() <= 0) && !isWinner && isStarted) {
      timer.current = setInterval(() => {
        setCount((prev) => ({
          ...prev,
          time: Math.floor(getElapsedRunningTime() / 1000),
        }));
      }, 1000);
    }

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [isWinner, getElapsedRunningTime(), isStarted]);

  const start = useCallback((modeByUser: String = mode) => {
    reset();
    startTimer();
    setIsStarted(true);
    setMode(modeByUser);

    const modeNumber = Number(modeByUser.split("x")[0]);
    const modeTiles =
      (modeNumber * modeNumber) / 2 <= _.size(tileArray)
        ? _.shuffle(_.uniq(tileArray)).slice(0, (modeNumber * modeNumber) / 2)
        : [];

    setTiles(_.shuffle([...modeTiles, ...modeTiles]));
    setCount((prev) => ({ ...prev, mode: modeByUser }));
  }, []);

  const reset = useCallback(() => {
    setIsWinner(false);
    setIsStarted(false);
    setClickedCorrectTiles([]);
    setClickedTiles([]);
    setCount({ game: "tile", mode: "", guess: 0, point: 0, time: 0 });
    stopTimer();
    setTiles([]);
  }, []);

  const quit = useCallback(() => {}, []);
  const save = useCallback(() => {}, []);

  const onClickTile = useCallback(
    async (idx: Number) => {
      if (canClick) {
        setClickedTiles((prev) => _.uniq([...prev, idx]));

        if (_.size(_.uniq([...clickedTiles, idx])) >= 2) {
          setCanClick(false);
          if (tiles[clickedTiles[0] as any] === tiles[idx as any]) {
            // correct guess
            const pointToBeAdded =
              Math.sqrt(Number(_.size(tiles))) *
              Math.floor(
                pointPerGuess -
                  Number((getElapsedRunningTime() / 10000).toFixed(2))
              );

            setCount((prev) => ({
              ...prev,
              point: prev.point + (pointToBeAdded < 1 ? 1 : pointToBeAdded),
              guess: prev.guess + 1,
            }));

            setClickedCorrectTiles((prev) =>
              _.uniq([...prev, clickedTiles[0], idx])
            );
            if (
              _.size(_.uniq([...clickedCorrectTiles, clickedTiles[0], idx])) ===
              _.size(tiles)
            ) {
              // User wins the game (save the time)
              setIsWinner(true);
              setIsStarted(false);
              pauseTimer();
              // set winner time
              setCount((prev) => ({
                ...prev,
                time: Math.floor(getElapsedRunningTime() / 1000),
              }));
            }
          } else {
            // wrong guess. increment guess by 1
            setCount((prev) => ({ ...prev, guess: prev.guess + 1 }));
          }
          setClickedTiles((prev) => _.uniq([...prev, idx]));
          await new Promise((r) => setTimeout(r, 500));
          setClickedTiles([]);
          setCanClick(true);
        }
      }
    },
    [clickedTiles, clickedCorrectTiles, canClick]
  );

  return {
    tiles,
    start,
    quit,
    save,
    onClickTile,
    clickedTiles,
    clickedCorrectTiles,
    isWinner,
    isStarted,
    count,
    getElapsedRunningTime,
    reset,
  };
}

export default useTileGame;
