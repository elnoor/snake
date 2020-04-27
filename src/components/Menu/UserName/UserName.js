import React, { useState } from "react";
import "./UserName.css";
import Modal from "./../../Modal/Modal";

/*
 <UserName
  onBack={() => setUserNameModalOpen(false)}
  userName={settings.userName}
  updateUserName={updateUserName} />
*/
export default function UserName(props) {
  const [userName, setUserName] = useState(props.userName || "");

  function onChange(e) {
    var re = /^$|[a-zA-Z0-9-_]+$/;
    if (re.test(e.target.value)) {
      setUserName(e.target.value);
    }
  }

  function onSave() {
    props.updateUserName(userName);
    props.onBack();
  }

  return (
    <Modal
      open={true}
      header="USERNAME"
      footer={
        <div>
          <div className="float-right w-50" onClick={props.onBack}>
            BACK
          </div>
          <div className="float-left w-50" onClick={onSave}>
            SAVE
          </div>
        </div>
      }
    >
      <div className="username">
        <input
          type="text"
          name="userName"
          value={userName}
          onChange={onChange}
        />
        <legend>
          This username will appear in top scorers if you can make it to the
          list
        </legend>
      </div>
    </Modal>
  );
}
