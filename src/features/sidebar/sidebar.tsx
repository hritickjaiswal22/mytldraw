import { getFontSize, getStrokeStyleOption } from "@/utils/miscellaneous";
import { ObjectPropertiesContext } from "@/contexts/objectProperties";
import { TextPropertiesContext } from "@/contexts/textProperties";
import { ACTIONS } from "@/utils/actions";
import { socket } from "@/socket";
import {
  setFillColor,
  setOpacity,
  setStrokeColor,
  setStrokeStyle,
} from "@/utils/setFunctions";

import SidebarComponent from "@/components/sidebar";

import { useContext } from "react";
import { fabric } from "fabric";
import { useParams } from "react-router-dom";

interface SidebarPropTypes {
  fabricInst: fabric.Canvas;
}

function Sidebar({ fabricInst }: SidebarPropTypes) {
  const { setObjectProperties } = useContext(ObjectPropertiesContext);
  const { setTextProperties } = useContext(TextPropertiesContext);
  const { roomId } = useParams();

  function fillChangeHandler(color: string) {
    setObjectProperties((prev) => {
      return {
        ...prev,
        fill: color,
      };
    });

    const activeObject = fabricInst?.getActiveObject();

    if (activeObject) {
      socket.emit(ACTIONS["OBJECT:CHANGED"], {
        roomId,
        objectId: (activeObject as any).id,
        payload: color,
        action: ACTIONS["FILL:CHANGED"],
      });

      setFillColor(activeObject, color);

      fabricInst?.renderAll();
    }
  }

  function strokeWidthChangeHandler(option: number) {
    setObjectProperties((prev) => {
      return {
        ...prev,
        strokeWidth: option,
      };
    });

    const activeObject = fabricInst?.getActiveObject();

    if (activeObject) {
      socket.emit(ACTIONS["OBJECT:CHANGED"], {
        roomId,
        objectId: (activeObject as any).id,
        payload: option,
        action: ACTIONS["STOKEWIDTH:CHANGED"],
      });
      activeObject.set({
        strokeWidth: option,
      });
      fabricInst?.renderAll();
    }
  }

  function strokeColorChangeHandler(color: string) {
    setObjectProperties((prev) => {
      return {
        ...prev,
        stroke: color,
      };
    });
    if (
      fabricInst &&
      fabricInst.freeDrawingBrush &&
      fabricInst.freeDrawingBrush.color
    )
      fabricInst!.freeDrawingBrush!.color = color;

    const activeObject = fabricInst?.getActiveObject();

    if (activeObject) {
      socket.emit(ACTIONS["OBJECT:CHANGED"], {
        roomId,
        objectId: (activeObject as any).id,
        payload: color,
        action: ACTIONS["STOKE:CHANGED"],
      });

      setStrokeColor(activeObject, color);

      fabricInst?.renderAll();
    }
  }

  function strokeStyleChangeHandler(option: number) {
    setObjectProperties((prev) => {
      return {
        ...prev,
        strokeDashArray: getStrokeStyleOption(option),
      };
    });

    const activeObject = fabricInst?.getActiveObject();

    if (activeObject) {
      socket.emit(ACTIONS["OBJECT:CHANGED"], {
        roomId,
        objectId: (activeObject as any).id,
        payload: getStrokeStyleOption(option),
        action: ACTIONS["STROKESTYLE:CHANGED"],
      });
      setStrokeStyle(activeObject, getStrokeStyleOption(option));
      fabricInst?.renderAll();
    }
  }

  function opacityChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setObjectProperties((prev) => {
      return {
        ...prev,
        opacity: Number(e.target.value),
      };
    });

    const activeObject = fabricInst?.getActiveObject();

    if (activeObject) {
      socket.emit(ACTIONS["OBJECT:CHANGED"], {
        roomId,
        objectId: (activeObject as any).id,
        payload: Number(e.target.value),
        action: ACTIONS["OPACITY:CHANGED"],
      });

      setOpacity(activeObject, Number(e.target.value));

      fabricInst?.renderAll();
    }
  }

  function sendToBackHandler() {
    if (fabricInst) {
      const activeObject = fabricInst?.getActiveObject();

      if (activeObject) {
        socket.emit(ACTIONS["OBJECT:CHANGED"], {
          roomId,
          objectId: (activeObject as any).id,
          payload: "",
          action: ACTIONS.SENDTOBACK,
        });

        fabricInst.sendToBack(activeObject);

        fabricInst?.renderAll();
      }
    }
  }

  function sendBackwards() {
    if (fabricInst) {
      const activeObject = fabricInst?.getActiveObject();

      if (activeObject) {
        socket.emit(ACTIONS["OBJECT:CHANGED"], {
          roomId,
          objectId: (activeObject as any).id,
          payload: "",
          action: ACTIONS.SENDBACKWARD,
        });

        fabricInst.sendToBack(activeObject);

        fabricInst?.renderAll();
      }
    }
  }

  function bringToFront() {
    if (fabricInst) {
      const activeObject = fabricInst?.getActiveObject();

      if (activeObject) {
        socket.emit(ACTIONS["OBJECT:CHANGED"], {
          roomId,
          objectId: (activeObject as any).id,
          payload: "",
          action: ACTIONS.BRINGTOFRONT,
        });

        fabricInst.bringToFront(activeObject);

        fabricInst?.renderAll();
      }
    }
  }

  function bringForward() {
    if (fabricInst) {
      const activeObject = fabricInst?.getActiveObject();

      if (activeObject) {
        socket.emit(ACTIONS["OBJECT:CHANGED"], {
          roomId,
          objectId: (activeObject as any).id,
          payload: "",
          action: ACTIONS.BRINGFORWARD,
        });

        fabricInst.bringForward(activeObject);

        fabricInst?.renderAll();
      }
    }
  }

  function deleteSelecedObject() {
    if (fabricInst) {
      const activeObject = fabricInst?.getActiveObject();

      if (activeObject) {
        fabricInst.remove(activeObject);
      }
    }
  }

  function textSizeChangeHandler(option: number) {
    setTextProperties({
      fontSize: getFontSize(option),
    });

    const activeObject = fabricInst.getActiveObject();

    if (activeObject && activeObject.type === "i-text") {
      socket.emit(ACTIONS["OBJECT:CHANGED"], {
        roomId,
        objectId: (activeObject as any).id,
        payload: getFontSize(option),
        action: ACTIONS["FONTSIZE:CHANGED"],
      });

      (activeObject as fabric.IText).set({
        fontSize: getFontSize(option),
      });
      fabricInst.renderAll();
    }
  }

  return (
    <SidebarComponent
      fillChangeHandler={fillChangeHandler}
      strokeWidthChangeHandler={strokeWidthChangeHandler}
      strokeColorChangeHandler={strokeColorChangeHandler}
      strokeStyleChangeHandler={strokeStyleChangeHandler}
      opacityChangeHandler={opacityChangeHandler}
      sendToBackHandler={sendToBackHandler}
      sendBackwards={sendBackwards}
      bringToFront={bringToFront}
      bringForward={bringForward}
      deleteSelecedObject={deleteSelecedObject}
      textSizeChangeHandler={textSizeChangeHandler}
    />
  );
}

export default Sidebar;
