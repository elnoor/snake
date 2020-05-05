import React, { useEffect, useState, useRef } from "react";
import Modal from "../Modal/Modal";
import "./GameOver.css";
import store from "store";
import axios from "axios";
import TopScorers from "../TopScorers/TopScorers";

export default function GameOver(props) {
  const record = useRef(store.get("record") || 0); // get user's best score stored in browser memory
  const [hasNewRecord, setHasNewRecord] = useState(false);
  const [showTopScorers, setShowTopScorers] = useState(false);

  useEffect(() => {
    if (props.score > record.current) {
      store.set("record", props.score);
      setHasNewRecord(true);

      if (props.userName) {
        axios
          .post("/.netlify/functions/create-top-scorer", {
            name: props.userName,
            score: props.score
          })
          .then((response) => {
            // console.log(response);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [props.score, props.userName]);

  useEffect(() => {
    // play again when spacebar pressed on keyboard
    function onKeyPress(e) {
      if (e.keyCode === 32) {
        props.playAgain();
      }
    }
    document.addEventListener("keydown", onKeyPress);
    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
  }, [props]);

  function render() {
    if (showTopScorers) {
      return (
        <TopScorers
          onBack={() => setShowTopScorers(false)}
          userName={props.userName}
        />
      );
    }
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
          {
            record.current && parseInt(record.current) > 0 ? (
              <h5 className="d-flex">
                <span className="w-100 float-left">
                  {hasNewRecord ? "Your old record" : "Your record"}:{" "}
                  {record.current}
                </span>
                <span
                  className="w-100 float-right cursor-pointer"
                  onClick={() => setShowTopScorers(true)}
                >
                  Top scorers
                </span>
              </h5>
            ) : null // on purpose
          }
        </div>
      </Modal>
    );
  }
  return render();
}
