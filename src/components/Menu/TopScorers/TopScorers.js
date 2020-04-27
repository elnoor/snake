import React, { useState, useEffect } from "react";
import "./TopScorers.css";
import loadingImage from "../../../assets/img/loading.svg";
import axios from "axios";
import Modal from "./../../Modal/Modal";

export default function TopScorers(props) {
  const [topScorers, setTopScorers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/.netlify/functions/get-top-scorers")
      .then((response) => {
        setTopScorers(response.data.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .then(function () {
        setLoading(false);
      });
  }, []);

  return (
    <Modal
      open={true}
      header="TOP SCORERS"
      footer={
        <div>
          <div className="float-right w-50" onClick={props.onBack}>
            BACK
          </div>
          <div className="float-left w-50" onClick={props.onClose}>
            CLOSE
          </div>
        </div>
      }
    >
      <div className="top-scorers">
        {loading ? (
          <img src={loadingImage} alt="loading..." />
        ) : topScorers && topScorers.length > 0 ? (
          <ul>
            {topScorers.map((ts, index) => (
              <li
                key={index}
                className={
                  "d-flex" + (ts.name === props.userName ? " active" : "")
                }
              >
                <span className="w-100">{ts.data.name}</span>
                <span>{ts.data.score}</span>
              </li>
            ))}
          </ul>
        ) : (
          <span>Nothing found here</span>
        )}
      </div>
    </Modal>
  );
}
