import React, { useEffect, useState, useCallback } from "react";
import "./Game.css";

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
  const [grid, setGrid] = useState([]);
  const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
  const [stomach, setStomach] = useState([]);
  const [direction, setDirection] = useState("right");
  const [food, setFood] = useState([getRandomFood()]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

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

  // move snake in a direction continiously or with user input
  useEffect(() => {
    var touchStartX = null;
    var touchStartY = null;

    function onTouchStart(evt) {
      const firstTouch = evt.touches[0];
      touchStartX = firstTouch.clientX;
      touchStartY = firstTouch.clientY;
    }

    function onTouchEnd(evt) {
      if (!touchStartX || !touchStartY) {
        return;
      }

      var touchEndX = evt.touches[0].clientX;
      var touchEndY = evt.touches[0].clientY;

      var diffX = touchStartX - touchEndX;
      var diffY = touchStartY - touchEndY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        changeDirection(diffX > 0 ? "left" : "right");
      } else {
        changeDirection(diffY > 0 ? "up" : "down");
      }
      touchStartX = null;
      touchStartY = null;
    }

    function onButtonClicked(e) {
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
    }

    function changeDirection(_direction) {
      if (
        _direction &&
        // not same direction
        _direction !== direction &&
        // moving reverse not allowed
        ((_direction === "right" && direction !== "left") ||
          (_direction === "left" && direction !== "right") ||
          (_direction === "up" && direction !== "down") ||
          (_direction === "down" && direction !== "up"))
      ) {
        clearInterval(interval);
        setDirection(_direction);
        moveSnake(_direction);
      }
    }

    if (!gameOver) {
      document.addEventListener("keydown", onButtonClicked);
      document.addEventListener("touchstart", onTouchStart);
      document.addEventListener("touchend", onTouchEnd);
    }

    return () => {
      document.removeEventListener("keydown", onButtonClicked);
      document.addEventListener("touchstart", onTouchStart);
      document.addEventListener("touchend", onTouchEnd);
      clearInterval(interval);
    };
  }, [direction, moveSnake, gameOver]);

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
    setGameOver(false);
  }

  return (
    <div className="game">
      <div className="header">
        <h3>Candy Snake</h3>
        {gameOver && (
          <span className="left">
            Game Over! <u onClick={reset}>Play Again</u>
          </span>
        )}
        <span className="right">Score: {score}</span>
      </div>
      <Board grid={grid} />
    </div>
  );
}

// Use memo, so that render will happen once per props change (grid)
const Board = React.memo((props) => {
  function render() {
    return (
      <table>
        <tbody>
          {props.grid.map((row, rowIndex) => {
            return (
              <tr key={rowIndex}>
                {row.map((column, colIndex) => {
                  return (
                    <td key={colIndex} className={column}>
                      <span />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
  return render();
});
