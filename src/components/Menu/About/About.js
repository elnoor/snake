import React from "react";
import Modal from "./../../Modal/Modal";
import "./About.css";

export default function About(props) {
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
      <div className="about">
        <h3 className="margin-top-0">Welcome to Candy Snake</h3>
        Snake games are awesome, but they are all same... We wanted to build a
        little modernized one. In traditional snake games goal is to eat as much
        food as possible so that snake will be as long as possible. Despite of
        that in Candy Snake the goal is to eat wisely to stay shorter as longer
        snake means harder game due to less space. To achieve that player needs
        to eat food with the same type as much as possible. Eating 3 food with
        same type in a row will cause a burst effect. Burst effect won't only
        shorten the snake but will also triple the score got by eating 3 food
        lastly.
        <br />
        Every type of food is different from score perspective. And remember,
        not every single food brings positive score ;) It is on you - the player
        to find out which food... Good news, burst effect will still bring
        positive score with food that has negative score.
        <br />
        There is a limit on the number of food that will be lying on the board.
        To push the game to generate new food, player has to eat existing ones.
        It is good idea to be careful when doing so.
        <br />
        <br />
        <h3>Authors</h3>
        <p>
          <a
            href="https://www.linkedin.com/in/elnoor/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Elnur Mammadli
          </a>
          &nbsp;Software Developer
        </p>
        <p>
          <a
            href="https://www.behance.net/ziyas/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ziya Suleymanzadeh
          </a>
          &nbsp;Graphic Designer
        </p>
        <br />
        <h3 className="margin-top-0">Technical</h3>
        <p>
          This project has been built using JavaScript and React as well as
          HTML, CSS. Some AWS Lambda and FaunaDB has been used to store Top
          Scorers. This project is open source at&nbsp;
          <a
            href="https://github.com/elnoor/snake"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </Modal>
  );
}
