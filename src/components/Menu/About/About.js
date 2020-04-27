import React from "react"
import Modal from './../../Modal/Modal';


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
        Under construction
      </Modal>
    );
  }
  