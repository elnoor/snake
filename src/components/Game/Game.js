import React, { useEffect, useState, useCallback, useRef } from "react";
import "./Game.css";
import { Board } from "./../Board/Board";
import { NavPad } from "./../NavPad/NavPad";
import GameOver from "./../GameOver/GameOver";
import store from "store";
import Menu from "../Menu/Menu/Menu";
import { themes } from "../../constants/enums";
import UserName from "../UserName/UserName";

const WIDTH = 12;
const HEIGHT = 12;
const SNAKE_SPEED = 150;
const FOOD_SPAWN_SPEED = 3000;
const FOOD_OPTIONS = [
  { type: "red", score: 1 },
  { type: "green", score: 2 },
  { type: "blue", score: 3 },
  { type: "orange", score: 4 },
  { type: "gold", score: 10 },
  { type: "black", score: -5 },
];

export default function Game() {
  const layout = useRef({ gridSize: {}, navPadSize: {}, landscape: false });
  const [settings, setSettings] = useState({});
  const [grid, setGrid] = useState([]);
  const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
  const [stomach, setStomach] = useState([]);
  const [direction, setDirection] = useState("right");
  const [food, setFood] = useState([getRandomFood()]);
  const [score, setScore] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // one time mounted stuff here
  useEffect(() => {
    // get settings stored in browser memory
    const _settings = store.get("settings") || {};

    // read theme from url and set it in settings (below) as default if none is set
    if (window.location.search && !_settings.theme) {
      const themeKey = new URLSearchParams(window.location.search).get("theme");
      if (themeKey) {
        const theme = Object.values(themes).find(
          (t) => t.key.toLowerCase() === themeKey.toLowerCase()
        );
        if (theme) {
          _settings.theme = theme;
        }
      }
    }
    setSettings(_settings);

    // detect screen size change, adjust grid size based on it, place navpad based on ladscape/portrait mode
    function getLayout() {
      const headerheight = 50;
      const innerPadding = 25;
      const innerHeight = window.innerHeight - innerPadding * 2;
      const innerWidth = window.innerWidth - innerPadding * 2;

      if (innerWidth < innerHeight) {
        layout.current = {
          landscape: false,
          gridSize: {
            height: innerWidth + headerheight,
            width: innerWidth,
          },
        };
        layout.current.navPadSize = {
          height: innerHeight - layout.current.gridSize.height,
          width: layout.current.gridSize.width,
        };
      } else {
        layout.current = {
          landscape: true,
          gridSize: {
            height: innerHeight,
            width: innerHeight - headerheight,
          },
        };
        layout.current.navPadSize = {
          height: layout.current.gridSize.height,
          width: innerWidth - layout.current.gridSize.width,
        };
      }
    }
    getLayout(); // initial call

    window.addEventListener("resize", getLayout);
    return () => {
      window.removeEventListener("resize", getLayout);
    };
  }, []);

  const moveSnake = useCallback(
    (_direction) => {
      // make the grid to display
      function makeGrid(_snake, _food, _stomach) {
        const _grid = [];

        for (let r = 0; r < HEIGHT; r++) {
          const row = [];
          for (let c = 0; c < WIDTH; c++) {
            row.push(null);
          }
          _grid.push(row);
        }

        // coordinates in which snake is located
        _snake.forEach((s, i) => {
          _grid[s.y][s.x] = `snake ${
            i === _snake.length - 1 ? `head ${_direction}` : _stomach[i] || ""
          }`;
        });

        // coordinates in which food is located
        _food.forEach((f) => {
          var cell = _grid[f.y][f.x];
          if (cell === null) {
            _grid[f.y][f.x] = `food ${f.type}`;
          }
        });

        setGrid(_grid);
      }

      const _snake = [...snake];
      const head = { ..._snake[_snake.length - 1] }; // head doesn't store food
      const max = { x: WIDTH - 1, y: HEIGHT - 1 };
      switch (_direction) {
        case "right":
          head.x++;
          head.x = head.x > max.x ? 0 : head.x;
          break;
        case "left":
          head.x--;
          head.x = head.x < 0 ? max.x : head.x;
          break;
        case "up":
          head.y--;
          head.y = head.y < 0 ? max.y : head.y;
          break;
        case "down":
          head.y++;
          head.y = head.y > max.y ? 0 : head.y;
          break;
        default:
          break;
      }

      // touched itself
      if (_snake.some((s) => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        return;
      }

      let removeTail = true;
      let _food = [...food];
      let _stomach = [...stomach];

      const foodIndex = _food.findIndex(
        (f) => f.x === head.x && f.y === head.y
      );
      // ate food
      if (foodIndex > -1) {
        removeTail = false; // keep tail, got longer
        const eatenFood = _food[foodIndex];
        _food.splice(foodIndex, 1); // remove eaten food from board
        _stomach.push(eatenFood.type);
        const stomachLength = _stomach.length;

        let foodScore = eatenFood.score;
        if (stomachLength >= 3) {
          // 3 same type of food in a row in stomach is burst
          if (
            _stomach[stomachLength - 1] === _stomach[stomachLength - 2] &&
            _stomach[stomachLength - 2] === _stomach[stomachLength - 3]
          ) {
            foodScore = Math.abs(foodScore) + Math.abs(10 * foodScore);
            _stomach.splice(stomachLength - 3, 3); // remove last 3 food from stomach
            _snake.splice(0, 3); // remove first 3 nodes from snake (tails)
          }
        }
        setScore((prevScore) => prevScore + foodScore);
      }

      _snake.push(head);

      if (removeTail) {
        _snake.shift();
      }

      setStomach(_stomach);
      setFood(_food);
      setSnake(_snake);
      makeGrid(_snake, _food, _stomach, _direction);
    },
    [snake, stomach, food]
  );

  const changeDirection = useCallback(
    (_direction) => {
      if (
        !gameOver &&
        _direction &&
        // not same direction
        _direction !== direction &&
        // moving reverse not allowed
        ((_direction === "right" && direction !== "left") ||
          (_direction === "left" && direction !== "right") ||
          (_direction === "up" && direction !== "down") ||
          (_direction === "down" && direction !== "up"))
      ) {
        moveSnake(_direction);
        setDirection(_direction);
        setIntervalId((prevIntervalId) => {
          clearInterval(prevIntervalId);
          return null;
        });
      }
    },
    [moveSnake, direction, gameOver]
  );

  // move snake in a direction continiously or with user input
  useEffect(() => {
    function onKeyPress(e) {
      changeDirection(
        e.keyCode === 37
          ? "left"
          : e.keyCode === 38
          ? "up"
          : e.keyCode === 39
          ? "right"
          : e.keyCode === 40
          ? "down"
          : null
      );
    }

    let interval;
    if (!gameOver) {
      // keep snake moving
      interval = setInterval(() => {
        moveSnake(direction);
      }, SNAKE_SPEED);
      setIntervalId(interval);

      document.addEventListener("keydown", onKeyPress);
    }

    return () => {
      document.removeEventListener("keydown", onKeyPress);
      clearInterval(interval);
    };
  }, [direction, moveSnake, gameOver, changeDirection]);

  // generate certain number of food periodically if needed
  useEffect(() => {
    let interval;
    if (!gameOver) {
      function makeFood() {
        setFood((prevFood) => {
          // max number of food possible to have on board
          const maxFoodCount = (WIDTH * HEIGHT) / 20;
          if (prevFood.length < maxFoodCount) {
            const newFood = [];
            // max number of new food can be generated each time
            for (let i = 0; i <= maxFoodCount / 5; i++) {
              const cell = getRandomFood();
              newFood.push(cell);
              if (prevFood.length + newFood.length === maxFoodCount) {
                break;
              }
            }
            return prevFood.concat(newFood);
          }
          return prevFood;
        });
      }

      interval = setInterval(() => {
        makeFood();
      }, FOOD_SPAWN_SPEED);
    }
    return () => {
      clearInterval(interval);
    };
  }, [gameOver]);

  function getRandomFood() {
    let x = Math.floor(Math.random() * WIDTH);
    let y = Math.floor(Math.random() * HEIGHT);

    const foodOption =
      FOOD_OPTIONS[Math.floor(Math.random() * FOOD_OPTIONS.length)];
    return { x, y, ...foodOption };
  }

  function reset() {
    setSnake([{ x: 0, y: 0 }]);
    setStomach([]);
    setDirection("right");
    setScore(0);
    setIntervalId(null);
    setGameOver(false);
  }

  function render() {
    const { gridSize, landscape, navPadSize } = layout.current;
    return (
      <div className={"game " + (settings.theme ? settings.theme.key : "")}>
        {(settings && !settings.userName) && (
          <UserName
            initialCheck={true}
            settings={settings}
            updateSettings={setSettings}
          />
        )}
        {gameOver && (
          <GameOver
            score={score}
            userName={settings.userName}
            playAgain={reset}
          />
        )}
        <div
          className="main"
          style={{
            width: gridSize.width + "px",
            height: gridSize.height + "px",
          }}
        >
          <div className="header">
            <div className="left">
              <Menu settings={settings} updateSettings={setSettings} />
            </div>
            <div className="center">
              {settings.theme ? settings.theme.value : themes.candySnake.value}
            </div>
            <div className="right">{score}</div>
          </div>
          <Board grid={grid} showGridBorder={settings.showGridBorder} />
        </div>
        <NavPad
          onClick={changeDirection}
          width={navPadSize.width}
          height={navPadSize.height}
          landscape={landscape}
          vibration={settings.vibration}
        />
      </div>
    );
  }
  return render();
}
