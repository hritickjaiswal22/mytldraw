import { socket } from "@/socket";

import { ReactNode, useEffect } from "react";
import { fabric } from "fabric";
import { ACTIONS } from "@/utils/actions";

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

  return <>{children}</>;
}

export default Receiver;
