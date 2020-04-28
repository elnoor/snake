import React, { useEffect, useState } from "react";
import { themes } from "../../../constants/enums";
import store from "store";
import Modal from "./../../Modal/Modal";
import UserName from "../../UserName/UserName";
import "./Settings.css";

/*
 <Settings
    settings={props.settings}
    updateSettings={props.updateSettings}
    onBack={() => setSelectedOption(null)} />
*/
export default function Settings(props) {
  const [userNameModalOpen, setUserNameModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState({
    vibration: false,
    showGridBorder: true,
    theme: themes.candySnake,
    userName: "",
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
    setHasChanges(true);
  }

  function apply() {
    store.set("settings", settings);
    props.updateSettings({ ...settings });
    setHasChanges(false);
  }

  function updateUserName(userName) {
    setSettings((prevSettings) => {
      return { ...prevSettings, userName };
    });
    setHasChanges(true);
  }

  function render() {
    if (userNameModalOpen) {
      return (
        <UserName
          onBack={() => setUserNameModalOpen(false)}
          userName={settings.userName}
          updateUserName={updateUserName}
        />
      );
    }
    return (
      <Modal
        open={true}
        header="SETTINGS"
        footer={
          <div>
            <div className="float-right w-50" onClick={props.onBack}>
              BACK
            </div>
            <div
              className={"float-left w-50" + (hasChanges ? "" : " disabled")}
              onClick={apply}
            >
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
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="showGridBorder"
                    onChange={onChange}
                    checked={settings.showGridBorder}
                  />
                  <span className="checkmark"></span>
                </label>
              </span>
            </li>
            <li className="d-flex">
              <span className="w-100 text-left">Username</span>
              <span
                className="w-100 text-right cursor-pointer"
                onClick={() => setUserNameModalOpen(true)}
              >
                {settings.userName || "Not set"}
              </span>
            </li>
          </ul>
          <h4>Mobile</h4>
          <ul>
            <li>
              <span>Vibration</span>
              <span>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="vibration"
                    onChange={onChange}
                    checked={settings.vibration}
                  />
                  <span className="checkmark"></span>
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
