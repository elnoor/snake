import React from "react";
import "./NavPad.css";

/*
<NavPad
    onClick={changeDirection}
    width={navPadSize.width}
    height={navPadSize.height}
    landscape={landscape}
    vibration={settings.vibration}
  />
*/

// Controller pad to be used in mobile devices
export const NavPad = React.memo((props) => {
  function onClick(_direction) {
    props.onClick(_direction);
    if (props.vibration) {
      window.navigator.vibrate(10);
    }
  }

  function render() {
    const innerSize =
      props.width < props.height ? props.width : props.height + "px";
    return (
      <div
        className={"navpad" + (props.landscape ? " landscape" : "")}
        style={{ width: props.width + "px", height: props.height + "px" }}
      >
        <div className="inner" style={{ width: innerSize, height: innerSize }}>
          <div className="buttons">
            <button className="up" onClick={() => onClick("up")}>
              <span></span>
            </button>
            <button className="right" onClick={() => onClick("right")}>
              <span></span>
            </button>
            <button className="left" onClick={() => onClick("left")}>
              <span></span>
            </button>
            <button className="down" onClick={() => onClick("down")}>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  return render();
});
