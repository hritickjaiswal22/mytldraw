import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";
import { socket } from "@/socket";
import { ACTIONS } from "@/utils/actions";

import { fabric } from "fabric";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

interface SnapperPropTypes {
  snap: boolean;
}

function Snapper({ snap }: SnapperPropTypes) {
  const { fabricInst } = useContext(FabricCanvasContext);
  const { roomId } = useParams();

  useEffect(() => {
    const horizontalSnapLine = fabricInst?._objects.find(
      (obj) => (obj as any).id === "horizontal-snap-line"
    );
    const verticalSnapLine = fabricInst?._objects.find(
      (obj) => (obj as any).id === "vertical-snap-line"
    );

    function getTop(obj: fabric.Object) {
      return obj.top;
    }

    function getBottom(obj: fabric.Object) {
      return obj.top + obj.getScaledHeight();
    }

    function getLeft(obj: fabric.Object) {
      return obj.left;
    }

    function getRight(obj: fabric.Object) {
      return obj.left + obj.getScaledWidth();
    }

    function snapObjects(e: fabric.IEvent<Event>) {
      if (e.target) {
        const movingObject = e.target;
        horizontalSnapLine?.set({
          visible: false,
        });
        verticalSnapLine?.set({
          visible: false,
        });
        let didSnap = false;

        fabricInst?._objects.forEach((obj) => {
          if (obj && obj !== movingObject) {
            // Snapping moving object's top
            if (Math.abs(movingObject.top - getTop(obj)) < 10) {
              movingObject.set({
                top: getTop(obj),
              });
              horizontalSnapLine?.set({
                top: getTop(obj),
                visible: true,
              });
              didSnap = true;
            }

            if (Math.abs(movingObject.top - getBottom(obj)) < 10) {
              movingObject.set({
                top: getBottom(obj),
              });
              horizontalSnapLine?.set({
                top: getBottom(obj),
                visible: true,
              });
              didSnap = true;
            }

            // Snapping moving object's bottom
            if (Math.abs(getBottom(movingObject) - getTop(obj)) < 10) {
              movingObject.set({
                top: getTop(obj) - movingObject.getScaledHeight(),
              });
              horizontalSnapLine?.set({
                top: getTop(obj),
                visible: true,
              });
              didSnap = true;
            }

            if (Math.abs(getBottom(movingObject) - getBottom(obj)) < 10) {
              movingObject.set({
                top: getBottom(obj) - movingObject.getScaledHeight(),
              });
              horizontalSnapLine?.set({
                top: getBottom(obj),
                visible: true,
              });
              didSnap = true;
            }

            // Snapping moving object's left
            if (Math.abs(movingObject.left - getLeft(obj)) < 10) {
              movingObject.set({
                left: getLeft(obj),
              });
              verticalSnapLine?.set({
                left: getLeft(obj),
                visible: true,
              });
              didSnap = true;
            }

            if (Math.abs(movingObject.left - getRight(obj)) < 10) {
              movingObject.set({
                left: getRight(obj),
              });
              verticalSnapLine?.set({
                left: getRight(obj),
                visible: true,
              });
              didSnap = true;
            }

            // Snapping moving object's right
            if (Math.abs(getRight(movingObject) - getLeft(obj)) < 10) {
              movingObject.set({
                left: getLeft(obj) - movingObject.getScaledWidth(),
              });
              verticalSnapLine?.set({
                left: getLeft(obj),
                visible: true,
              });
              didSnap = true;
            }

            if (Math.abs(getRight(movingObject) - getRight(obj)) < 10) {
              movingObject.set({
                left: getRight(obj) - movingObject.getScaledWidth(),
              });
              verticalSnapLine?.set({
                left: getRight(obj),
                visible: true,
              });
              didSnap = true;
            }

            if (didSnap) {
              const json = movingObject?.toJSON(["id"]);

              socket.emit(ACTIONS["OBJECT:MOVING"], { roomId, json });
            }
          }
        });
      }
    }

    function onStopMoving() {
      horizontalSnapLine?.set({
        visible: false,
      });
      verticalSnapLine?.set({
        visible: false,
      });
    }

    if (fabricInst && snap) {
      fabricInst.on("object:moving", snapObjects);
      fabricInst.on("object:modified", onStopMoving);
    }

    return () => {
      console.log("Switching off snapping");

      fabricInst?.off("object:moving", snapObjects);
      fabricInst?.off("object:modified", onStopMoving);
    };
  }, [fabricInst, snap]);

  return <></>;
}

export default Snapper;
