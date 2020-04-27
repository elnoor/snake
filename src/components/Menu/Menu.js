import React, { useState, useEffect } from "react";
import "./Menu.css";
import Modal from "../Modal/Modal";
import store from "store";
import axios from "axios";
import { menuOptions, themes } from "../../constants/enums";
import loadingImage from "../../assets/img/loading.svg";

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
  const [settings, setSettings] = useState({
    vibration: false,
    showGridBorder: true,
    theme: themes.candySnake,
  });

  useEffect(() => {
    setSettings((prevSettings) => {
      return { ...prevSettings, ...props.settings };
    });
  }, [props.settings]);

  function onChange(e) {
    let { name, value, checked, type } = e.target;
    const _settings = { ...settings };

    if (type === "checkbox") {
      _settings[name] = checked;
    } else if (type === "select-one") {
      if (name === "theme") {
        value = themes[value];
      }
      _settings[name] = value;
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
            <div className="float-right w-50" onClick={props.onBack}>
              BACK
            </div>
            <div className="float-left w-50" onClick={apply}>
              APPLY
            </div>
          </div>
        }
      >
        <div className="settings">
          <ul>
            <li className="d-flex">
              <span className="w-100 text-left">Theme</span>
              <select
                name="theme"
                value={settings.theme.key}
                onChange={onChange}
                className="float-right"
              >
                {Object.values(themes).map((theme) => (
                  <option key={theme.key} value={theme.key}>
                    {theme.value}
                  </option>
                ))}
              </select>
            </li>
            <li className="d-flex">
              <span className="w-100 text-left">Grid border</span>
              <span>
                <label class="checkbox">
                  <input
                    type="checkbox"
                    name="showGridBorder"
                    onChange={onChange}
                    checked={settings.showGridBorder}
                  />
                  <span class="checkmark"></span>
                </label>
              </span>
            </li>
          </ul>
          <h4>Mobile</h4>
          <ul>
            <li>
              <span>Vibration</span>
              <span>
                <label class="checkbox">
                  <input
                    type="checkbox"
                    name="vibration"
                    onChange={onChange}
                    checked={settings.vibration}
                  />
                  <span class="checkmark"></span>
                </label>
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
  const [topScorers, setTopScorers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/.netlify/functions/get-top-scorers")
      .then((response, data) => {
        debugger;
        setTopScorers(response.json());
      })
      .catch((err) => {
        console.error(err);
      })
      .then(function() {
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
      {loading && <img src={loadingImage} alt="loading..." />}
      {topScorers && topScorers.length > 0 && (
        <ul>
          {topScorers.map((ts, index) => (
            <li>
              {ts.name} {ts.score}
            </li>
          ))}
        </ul>
      )}
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
          <div className="float-right w-50" onClick={props.onBack}>
            BACK
          </div>
          <div className="float-left w-50" onClick={props.onClose}>
            CLOSE
          </div>
        </div>
      }
    >
      Under construction
    </Modal>
  );
}
