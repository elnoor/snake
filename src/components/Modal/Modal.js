import React from "react";
import "./Modal.css";

/*
  <Modal
      open={true}
      header="MENU"
      footer={<div onClick={() => setShowMenu(false)}>CLOSE</div>}>
    Body here
  </Modal>
*/
export default function Modal(props) {
  function render() {
    return (
      props.open && (
        <div className="modal-wrapper">
          <div className="modal">
            <div className="modal-header">{props.header}</div>
            <div className="modal-body">{props.children}</div>
            <div className="modal-footer" onClick={props.onFooterClick}>{props.footer}</div>
          </div>
        </div>
      )
    );
  }
  return render();
}
