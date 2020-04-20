import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import "./Settings.css";
import store from "store";

export default function Settings(props) {
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
        header="Settings"
        footer={
          <div>
            <div style={{ width: "50%", float: "left" }} onClick={apply}>
              Apply
            </div>
            <div
              style={{ width: "50%", float: "right" }}
              onClick={props.closeSettings}
            >
              Close
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
