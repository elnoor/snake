import React, { useEffect, useState, useCallback } from "react";
import "./Game.css";

const WIDTH = 10;
const HEIGHT = 10;
const SNAKE_SPEED = 400;
const FOOD_SPAWN_SPEED = 3000;
const DIRECTION = { right: 39, left: 37, top: 38, bottom: 40 };
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
  const [direction, setDirection] = useState(DIRECTION.right);
  const [food, setFood] = useState([getRandomFood()]);
  const [score, setScore] = useState(0);

  const moveSnake = useCallback(
    (_direction) => {
      function makeGrid(_snake, _food) {
        const _grid = [];

        for (let r = 0; r < HEIGHT; r++) {
          const row = [];
          for (let c = 0; c < WIDTH; c++) {
            row.push(null);
          }
          _grid.push(row);
        }

        // coordinates in which snake is located
        _snake.forEach((s) => {
          _grid[s.y][s.x] = `snake ${s.foodType}`;
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
      const head = { ..._snake[_snake.length - 1] };
      const max = { x: WIDTH - 1, y: HEIGHT - 1 };
      switch (_direction) {
        case DIRECTION.right:
          head.x++;
          head.x = head.x > max.x ? 0 : head.x;
          break;
        case DIRECTION.left:
          head.x--;
          head.x = head.x < 0 ? max.x : head.x;
          break;
        case DIRECTION.top:
          head.y--;
          head.y = head.y < 0 ? max.y : head.y;
          break;
        case DIRECTION.bottom:
          head.y++;
          head.y = head.y > max.y ? 0 : head.y;
          break;
        default:
          break;
      }

      // touched itself
      if (_snake.some((s) => s.x === head.x && s.y === head.y)) {
        // if (window.confirm("Game Over")) {
        //   window.location.reload();
        // }
        return;
      }

      _snake.push(head);
      let removeTail = true;
      let _food = [];
      setFood((prevFood) => {
        // check if snake eats food
        const _prevFood = [...prevFood];
        const foodIndex = _prevFood.findIndex(
          (f) => f.x === head.x && f.y === head.y
        );
        if (foodIndex > -1) {
          const eatenFood = _prevFood[foodIndex];
          head.foodType = eatenFood.type; // food type in stomach
          setScore((prevScore) => prevScore + eatenFood.score);
          _prevFood.splice(foodIndex, 1); // remove eaten food from board
          removeTail = false;
        }
        _food = _prevFood;
        return _prevFood;
      });

      if (removeTail) {
        _snake.shift();
      }
      delete(_snake.foodType);

      setSnake(_snake);
      makeGrid(_snake, _food);
    },
    [snake]
  );

  // move snake in a direction continiously or with user input (direction)
  useEffect(() => {
    const interval = setInterval(() => {
      moveSnake(direction);
    }, SNAKE_SPEED);

    function onDirectionChange(e) {
      const _direction = e.keyCode;
      if (_direction !== direction) {
        clearInterval(interval);
        setDirection(_direction);
        moveSnake(_direction);
      }
    }
    document.addEventListener("keydown", onDirectionChange);

    return () => {
      document.removeEventListener("keydown", onDirectionChange);
      clearInterval(interval);
    };
  }, [direction, moveSnake]);

  // generate certain number of food periodically if needed
  useEffect(() => {
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

    const interval = setInterval(() => {
      makeFood();
    }, FOOD_SPAWN_SPEED);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function getRandomFood() {
    let x = Math.floor(Math.random() * WIDTH);
    // x = x < 0 ? 0 : x >= WIDTH ? WIDTH - 1 : x;

    let y = Math.floor(Math.random() * HEIGHT);
    // y = y < 0 ? 0 : y >= HEIGHT ? HEIGHT - 1 : y;

    const foodOption =
      FOOD_OPTIONS[Math.floor(Math.random() * FOOD_OPTIONS.length)];
    return { x, y, ...foodOption };
  }

  return <Board grid={grid} score={score} />;
}

// Use memo, so that render will happen once per props change
const Board = React.memo((props) => {
  function render() {
    return (
      <div className="board">
        Score: {props.score}
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
      </div>
    );
  }
  return render();
});
