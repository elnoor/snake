import React, { useState } from "react";
import "./Menu.css";
import Modal from "../../Modal/Modal";
import { menuOptions } from "../../../constants/enums";
import Settings from "./../Settings/Settings";
import TopScorers from "../../TopScorers/TopScorers";
import About from "./../About/About";

/*
  <Menu
    settings={settings}
    updateSettings={setSettings} />
*/
export default function (props) {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  function onBack() {
    setSelectedOption(null);
  }

  function onClose() {
    setSelectedOption(null);
    setShowMenu(false);
  }

  function getMenuOption() {
    if (selectedOption === menuOptions.settings) {
      return (
        <Settings
          settings={props.settings}
          updateSettings={props.updateSettings}
          onBack={() => setSelectedOption(null)}
        />
      );
    } else if (selectedOption === menuOptions.topScorers) {
      return <TopScorers onBack={onBack} onClose={onClose} userName={props.settings.userName} />;
    } else if (selectedOption === menuOptions.about) {
      return <About onBack={onBack} onClose={onClose} />;
    } else {
      return (
        <Modal
          open={true}
          header="MENU"
          footer={<div onClick={() => setShowMenu(false)}>CLOSE</div>}
        >
          <div className="menu">
            <ul>
              {Object.keys(menuOptions).map((key) => (
                <li key={key}>
                  <span onClick={() => setSelectedOption(menuOptions[key])}>
                    {menuOptions[key]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      );
    }
  }

  return (
    <div className="menu-wrapper">
      <div className="dots" onClick={() => setShowMenu(true)}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {showMenu && getMenuOption()}
    </div>
  );
}
