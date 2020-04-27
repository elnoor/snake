import React, { useEffect, useState, useRef } from "react";
import Modal from "../Modal/Modal";
import "./GameOver.css";
import store from "store";
import { axios } from "axios";

export default function GameOver(props) {
  const record = useRef(store.get("record") || 0); // get user's best score stored in browser memory
  const [hasNewRecord, setHasNewRecord] = useState(false);

  useEffect(() => {
    if (props.score > record.current) {
      store.set("record", props.score);
      setHasNewRecord(true);

      axios
        .post("/.netlify/functions/create-top-scorer", {
          name: "Elnur",
          score: props.score,
          date: new Date(),
        })
        .then((response) => {
          debugger;
          console.log(response.json());
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [props.score]);

  function render() {
    return (
      <Modal
        open={true}
        header="GAME OVER"
        footer="PLAY AGAIN"
        onFooterClick={props.playAgain}
      >
        <div className="game-over">
          <h3>YOUR SCORE</h3>
          <h1>{props.score}</h1>
          {hasNewRecord && (
            <h4>
              <p>Congratulations!</p> New record!
            </h4>
          )}
          {record.current && parseInt(record.current) > 0 && (
            <h5>
              {hasNewRecord ? "your old record" : "your record"}:{" "}
              {record.current}
            </h5>
          )}
        </div>
      </Modal>
    );
  }
  return render();
}
