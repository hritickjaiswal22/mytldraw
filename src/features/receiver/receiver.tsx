import { socket } from "@/socket";
import { ACTIONS } from "@/utils/actions";
import { setStrokeColor } from "@/utils/setFunctions";

import { ReactNode, useEffect } from "react";
import { fabric } from "fabric";

interface ReceiverPropTypes {
  fabricInst: fabric.Canvas | null;
  children: ReactNode;
}

function Receiver({ children, fabricInst }: ReceiverPropTypes) {
  useEffect(() => {
    if (fabricInst) {
      socket.on(ACTIONS["OBJECT:ADDED"], (str) => {
        fabric.util.enlivenObjects(
          [str],
          (objs: any) => {
            objs.forEach((item: fabric.Object) => {
              fabricInst.add(item);
            });
            fabricInst.renderAll();
          },
          ""
        );
      });
    }

    return () => {
      socket.off(ACTIONS["OBJECT:ADDED"]);
    };
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      socket.on(ACTIONS["OBJECT:MOVING"], (json) => {
        const id = json.id;
        const object = fabricInst._objects.find(
          (obj) => (obj as any).id === id
        );

        if (object) {
          object.set({
            left: json.left,
            top: json.top,
          });

          object.setCoords();
          fabricInst.renderAll();
        }
      });
    }

    return () => {
      socket.off(ACTIONS["OBJECT:MOVING"]);
    };
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      socket.on(ACTIONS["OBJECT:SCALING"], (json) => {
        const id = json.id;
        const object = fabricInst._objects.find(
          (obj) => (obj as any).id === id
        );

        if (object) {
          object.set({
            left: json.left,
            top: json.top,
            scaleX: json.scaleX,
            scaleY: json.scaleY,
          });

          object.setCoords();
          fabricInst.renderAll();
        }
      });
    }

    return () => {
      socket.off(ACTIONS["OBJECT:SCALING"]);
    };
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      socket.on(ACTIONS["OBJECT:ROTATING"], (json) => {
        const id = json.id;
        const object = fabricInst._objects.find(
          (obj) => (obj as any).id === id
        );

        if (object) {
          object.set({
            angle: json.angle,
            left: json.left,
            top: json.top,
          });

          object.setCoords();
          fabricInst.renderAll();
        }
      });
    }

    return () => {
      socket.off(ACTIONS["OBJECT:ROTATING"]);
    };
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      socket.on(ACTIONS["OBJECT:REMOVED"], (json) => {
        const id = json.id;
        const object = fabricInst._objects.find(
          (obj) => (obj as any).id === id
        );

        if (object) {
          fabricInst.remove(object);
        }
      });
    }

    return () => {
      socket.off(ACTIONS["OBJECT:REMOVED"]);
    };
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      socket.on(ACTIONS["TEXT:CHANGED"], (json) => {
        const id = json.id;
        const object = fabricInst._objects.find(
          (obj) => (obj as any).id === id
        );

        if (object) {
          (object as fabric.IText).set({
            text: json.text,
          });

          object.setCoords();
          fabricInst.renderAll();
        }
      });
    }

    return () => {
      socket.off(ACTIONS["TEXT:CHANGED"]);
    };
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      socket.on(ACTIONS["OBJECT:CHANGED"], ({ objectId, payload, action }) => {
        if (objectId) {
          const object = fabricInst._objects.find(
            (obj) => (obj as any).id === objectId
          );

          if (object) {
            switch (action) {
              case ACTIONS["STOKEWIDTH:CHANGED"]:
                object.set({
                  strokeWidth: payload,
                });
                fabricInst.renderAll();
                break;

              case ACTIONS["STOKE:CHANGED"]:
                setStrokeColor(object, payload);
                fabricInst.renderAll();
                break;

              default:
                break;
            }
          }
        }
      });
    }

    return () => {
      socket.off(ACTIONS["OBJECT:CHANGED"]);
    };
  }, [fabricInst]);

  return <>{children}</>;
}

export default Receiver;
