import React, { useState, useEffect } from "react";
import "./Menu.css";
import Modal from "../Modal/Modal";
import store from "store";

const menuOptions = {
  settings: "Settings",
  topScorers: "Top Scorers",
  about: "About",
};
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
          onBack={() => setSelectedOption(null)}
        />
      );
    } else if (selectedOption === menuOptions.topScorers) {
      return <TopScorers onBack={onBack} onClose={onClose} />;
    } else if (selectedOption === menuOptions.about) {
      return <About onBack={onBack} onClose={onClose} />;
    } else {
      return (
        <Modal
          open={true}
          header="MENU"
          footer={<div onClick={() => setShowMenu(false)}>CLOSE</div>}
        >
          <ul className="menu">
            {Object.keys(menuOptions).map((key) => (
              <li key={key}>
                <span onClick={() => setSelectedOption(menuOptions[key])}>
                  {menuOptions[key]}
                </span>
              </li>
            ))}
          </ul>
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

function Settings(props) {
  const [settings, setSettings] = useState({ vibration: false });

  useEffect(() => {
    setSettings((prevSettings) => {
      return { ...prevSettings, ...props.settings };
    });
  }, [props.settings]);

  function onChange(e) {
    const { name, value, checked, type } = e.target;
    const _settings = { ...settings };
    if (type === "checkbox") {
      _settings[name] = checked;
    }
    setSettings(_settings);
  }

  function apply() {
    store.set("settings", settings);
    window.location.reload();
  }
  function render() {
    return (
      <Modal
        open={true}
        header="SETTINGS"
        footer={
          <div>
            <div
              style={{ width: "50%", float: "right" }}
              onClick={props.onBack}
            >
              BACK
            </div>
            <div style={{ width: "50%", float: "left" }} onClick={apply}>
              APPLY
            </div>
          </div>
        }
      >
        <div className="settings">
          <h4>Mobile</h4>
          <ul>
            <li>
              <span>Vibration</span>
              <span>
                <input
                  type="checkbox"
                  name="vibration"
                  onChange={onChange}
                  checked={settings.vibration}
                />
              </span>
            </li>
          </ul>
        </div>
      </Modal>
    );
  }
  return render();
}

function TopScorers(props) {
  return (
    <Modal
      open={true}
      header="TOP SCORERS"
      footer={
        <div>
          <div style={{ width: "50%", float: "right" }} onClick={props.onBack}>
            BACK
          </div>
          <div style={{ width: "50%", float: "left" }} onClick={props.onClose}>
            CLOSE
          </div>
        </div>
      }
    >
      Under construction
    </Modal>
  );
}

function About(props) {
  return (
    <Modal
      open={true}
      header="TOP SCORERS"
      footer={
        <div>
          <div style={{ width: "50%", float: "right" }} onClick={props.onBack}>
            BACK
          </div>
          <div style={{ width: "50%", float: "left" }} onClick={props.onClose}>
            CLOSE
          </div>
        </div>
      }
    >
      Under construction
    </Modal>
  );
}
