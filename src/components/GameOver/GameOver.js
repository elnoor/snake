import React from "react";
import "./GameOver.css";
import Modal from "../Modal/Modal";

export default function GameOver(props) {
  function render() {
    return (
      <Modal
        open={true}
        header="Game Over"
        footer={<span onClick={props.playAgain}>Play Again</span>}
      >
        <h2>
          <small>Your Score</small>
          <br />
          <strong>{props.score}</strong>
        </h2>
      </Modal>
    );
  }
  return render();
}
