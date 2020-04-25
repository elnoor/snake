import React from "react";
import "./Board.css";

// Use memo, so that render will happen once per props change (grid)
export const Board = React.memo(({ grid, showGridBorder }) => {
  function render() {
    return (
      <table
        className={`board ${showGridBorder === false ?"borderless" : ""}`}
      >
        <tbody>
          {grid.map((row, rowIndex) => {
            return (
              <tr key={rowIndex}>
                {row.map((column, colIndex) => {
                  return (
                    <td key={colIndex} className={column}>
                      <div>
                        <span />
                      </div>
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
