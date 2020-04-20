import React, { useEffect, useState, useRef } from "react";
import Modal from "../Modal/Modal";
import store from "store";

export default function GameOver(props) {
  const record = useRef(0);
  const [newRecord, setNewRecord] = useState(false);

  useEffect(() => {
    // get user's best score stored in browser memory
    record.current = store.get("record") || 0;
    if (props.score > record.current) {
      store.set("record", props.score);
      setNewRecord(true);
    }
  }, [props.score]);

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
        {newRecord && (
          <h4>
            <strong style={{ display: "block" }}>Congratulations!</strong> That
            is a new record
          </h4>
        )}
        {record.current && record.current > 0 && (
          <h5>
            {newRecord ? "Old Record" : "Record"}: {record.current}
          </h5>
        )}
      </Modal>
    );
  }
  return render();
}
