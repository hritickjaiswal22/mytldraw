import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";

import { fabric } from "fabric";
import { useContext, useEffect } from "react";

interface SnapperPropTypes {
  snap: boolean;
}

function Snapper({ snap }: SnapperPropTypes) {
  const { fabricInst } = useContext(FabricCanvasContext);

  useEffect(() => {
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

        fabricInst?._objects.forEach((obj) => {
          if (obj && obj !== movingObject) {
            // Snapping moving object's top
            if (Math.abs(movingObject.top - getTop(obj)) < 10) {
              movingObject.set({
                top: getTop(obj),
              });
            }

            if (Math.abs(movingObject.top - getBottom(obj)) < 10) {
              movingObject.set({
                top: getBottom(obj),
              });
            }

            // Snapping moving object's bottom
            if (Math.abs(getBottom(movingObject) - getTop(obj)) < 10) {
              movingObject.set({
                top: getTop(obj) - movingObject.getScaledHeight(),
              });
            }

            if (Math.abs(getBottom(movingObject) - getBottom(obj)) < 10) {
              movingObject.set({
                top: getBottom(obj) - movingObject.getScaledHeight(),
              });
            }

            // Snapping moving object's left
            if (Math.abs(movingObject.left - getLeft(obj)) < 10) {
              movingObject.set({
                left: getLeft(obj),
              });
            }

            if (Math.abs(movingObject.left - getRight(obj)) < 10) {
              movingObject.set({
                left: getRight(obj),
              });
            }

            // Snapping moving object's right
            if (Math.abs(getRight(movingObject) - getLeft(obj)) < 10) {
              movingObject.set({
                left: getLeft(obj) - movingObject.getScaledWidth(),
              });
            }

            if (Math.abs(getRight(movingObject) - getRight(obj)) < 10) {
              movingObject.set({
                left: getRight(obj) - movingObject.getScaledWidth(),
              });
            }
          }
        });
      }
    }

    if (fabricInst && snap) {
      fabricInst.on("object:moving", snapObjects);
    }

    return () => {
      console.log("Switching off snapping");

      fabricInst?.off("object:moving", snapObjects);
    };
  }, [fabricInst, snap]);

  return <></>;
}

export default Snapper;
