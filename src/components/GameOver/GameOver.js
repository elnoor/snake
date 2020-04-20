import React from "react";
import Modal from "../Modal/Modal";

export default function GameOver(props) {
  function render() {
    return (
      <Modal
        open={true}
        header="Game Over"
        footer="Play Again"
        onFooterClick={props.playAgain}
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
