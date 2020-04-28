import React, { useState, useEffect } from "react";
import "./TopScorers.css";
import loadingImage from "../../assets/img/loading.svg";
import axios from "axios";
import Modal from "../Modal/Modal";

/*
    <TopScorers 
        onBack={onBack}
        onClose={onClose}
        userName={props.settings.userName} />
*/
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
        <div className="d-flex">
          {props.onClose && (
            <div className="float-left w-100" onClick={props.onClose}>
              CLOSE
            </div>
          )}
          {props.onBack && (
            <div className="float-right w-100" onClick={props.onBack}>
              BACK
            </div>
          )}
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
                  "d-flex" + (ts.data.name === props.userName ? " active" : "")
                }
              >
                <span style={{ marginRight: index < 3 ? "12px" : "15px" }}>
                  {index < 3 ? (
                    <svg viewBox="0 0 24 24">
                      <path
                        fill={
                          index === 0
                            ? "gold"
                            : index === 1
                            ? "silver"
                            : "#CD7F32"
                        }
                        d="M18 2C17.1 2 16 3 16 4H8C8 3 6.9 2 6 2H2V11C2 12 3 13 4 13H6.2C6.6 15 7.9 16.7 11 17V19.08C8 19.54 8 22 8 22H16C16 22 16 19.54 13 19.08V17C16.1 16.7 17.4 15 17.8 13H20C21 13 22 12 22 11V2H18M6 11H4V4H6V11M20 11H18V4H20V11Z"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="w-100">{ts.data.name}</span>
                <span>{ts.data.score}</span>
              </li>
            ))}
          </ul>
        ) : (
          <span>Nothing found here, try again later</span>
        )}
      </div>
    </Modal>
  );
}
