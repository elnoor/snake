import React, { useEffect, useState, useCallback } from "react";
import "./Game.css";

const WIDTH = 10;
const HEIGHT = 10;
const SNAKE_SPEED = 400;
const FOOD_SPAWN_SPEED = 3000;
const DIRECTION = { right: 39, left: 37, top: 38, bottom: 40 };

export default function Game() {
  const [grid, setGrid] = useState([]);
  const [snake, setSnake] = useState([[0, 0]]);
  const [direction, setDirection] = useState(DIRECTION.right);
  const [intervalId, setIntervalId] = useState(null);
  const [food, setFood] = useState([getRandomCell()]);

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
          _grid[s[1]][s[0]] = "snake";
        });

        // coordinates in which food is located
        _food.forEach((f) => {
          var cell = _grid[f[1]][f[0]];
          if (cell === null) {
            _grid[f[1]][f[0]] = "food";
          }
        });

        setGrid(_grid);
      }

      const _snake = [...snake];
      const head = _snake[_snake.length - 1];
      let headX = head[0];
      let headY = head[1];
      const maxY = HEIGHT - 1;
      const maxX = WIDTH - 1;
      switch (_direction) {
        case DIRECTION.right:
          headX++;
          headX = headX > maxX ? 0 : headX;
          break;
        case DIRECTION.left:
          headX--;
          headX = headX < 0 ? maxX : headX;
          break;
        case DIRECTION.top:
          headY--;
          headY = headY < 0 ? maxY : headY;
          break;
        case DIRECTION.bottom:
          headY++;
          headY = headY > maxY ? 0 : headY;
          break;
        default:
          break;
      }

      _snake.push([headX, headY]); // move (add) head
      let removeTail = true;
      let _food = [];
      setFood((prevFood) => {
        // check if snake eats food
        const _prevFood = [...prevFood];
        const foodIndex = _prevFood.findIndex(
          (f) => f[0] === headX && f[1] === headY
        );
        if (foodIndex > -1) {
          _prevFood.splice(foodIndex, 1); // remove food
          removeTail = false;
        }
        _food = _prevFood;
        return _prevFood;
      });

      if (removeTail) {
        _snake.shift();
      }

      setSnake(_snake);
      makeGrid(_snake, _food);
    },
    [snake]
  );

  useEffect(() => {
    function onDirectionChange(e) {
      const _direction = e.keyCode;
      if (_direction !== direction) {
        clearInterval(intervalId); // immediately make the turn
        setDirection(_direction);
        moveSnake(_direction);
      }
    }
    document.addEventListener("keydown", onDirectionChange);
    return () => document.removeEventListener("keydown", onDirectionChange);
  }, [direction, moveSnake, intervalId]);

  useEffect(() => {
    const interval = setInterval(() => {
      moveSnake(direction);
    }, SNAKE_SPEED);
    setIntervalId(interval);
    return () => {
      clearInterval(interval);
    };
  }, [moveSnake, direction]);

  useEffect(() => {
    function makeFood() {
      setFood((prevFood) => {
        // max number of food possible to have on board
        const maxFoodCount = (WIDTH * HEIGHT) / 20;
        if (prevFood.length < maxFoodCount) {
          const newFood = [];
          // max number of new food can be generated each time
          for (let i = 0; i <= maxFoodCount / 6; i++) {
            const cell = getRandomCell();
            newFood.push(cell);
            if ([prevFood].length + newFood.length === maxFoodCount) {
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

  function getRandomCell() {
    let x = Math.round(Math.random() * WIDTH);
    let y = Math.round(Math.random() * HEIGHT);
    x = x < 0 ? 0 : x >= WIDTH ? WIDTH - 1 : x;
    y = y < 0 ? 0 : y >= HEIGHT ? HEIGHT - 1 : y;
    return [x, y];
  }

  return <Board grid={grid} />;
}

// Use memo, so that render will happen once per grid change (props.grid)
const Board = React.memo((props) => {
  function render() {
    return (
      <div className="board">
        hello
        <table>
          <tbody>
            {props.grid.map((row, rowIndex) => {
              return (
                <tr key={rowIndex}>
                  {row.map((column, colIndex) => {
                    return (
                      <td key={colIndex}>
                        {column === "snake"
                          ? "x"
                          : column === "food"
                          ? "f"
                          : ""}
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
