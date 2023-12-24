import { socket } from "@/socket";

import { ReactNode, useEffect } from "react";
import { fabric } from "fabric";

interface ReceiverPropTypes {
  fabricInst: fabric.Canvas | null;
  children: ReactNode;
}

function Receiver({ children, fabricInst }: ReceiverPropTypes) {
  useEffect(() => {
    if (fabricInst) {
      socket.on("objet:added", (str) => {
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
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      socket.on("moving", (json) => {
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
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      socket.on("scaling", (json) => {
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
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      socket.on("rotating", (json) => {
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
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      socket.on("removed", (json) => {
        const id = json.id;
        const object = fabricInst._objects.find(
          (obj) => (obj as any).id === id
        );

        if (object) {
          fabricInst.remove(object);
        }
      });
    }
  }, [fabricInst]);

  return <>{children}</>;
}

export default Receiver;
