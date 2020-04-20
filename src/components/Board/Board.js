import React from "react";
import "./Board.css";

// Use memo, so that render will happen once per props change (grid)
export const Board = React.memo((props) => {
  function render() {
    return (
      <table className="board">
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
