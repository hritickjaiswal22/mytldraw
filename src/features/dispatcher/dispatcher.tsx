import { socket } from "@/socket";
import { ACTIONS } from "@/utils/actions";
import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";

import React, { ReactNode, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

interface DispatcherPropTypes {
  children: ReactNode;
}

function Dispatcher({ children }: DispatcherPropTypes) {
  const { fabricInst } = useContext(FabricCanvasContext);
  const { roomId } = useParams();

  function objectAddHandler() {
    const json = fabricInst?.getActiveObject()?.toJSON(["id"]);

    socket.emit(ACTIONS["OBJECT:ADDED"], { roomId, json });
  }

  function objectMoveHandler(e: fabric.IEvent<MouseEvent>) {
    const json = e.target?.toJSON(["id"]);

    socket.emit(ACTIONS["OBJECT:MOVING"], { roomId, json });
  }

  function objectScaleHandler(e: fabric.IEvent<MouseEvent>) {
    const json = e.target?.toJSON(["id"]);

    socket.emit(ACTIONS["OBJECT:SCALING"], { roomId, json });
  }

  function objectRotateHandler(e: fabric.IEvent<MouseEvent>) {
    const json = e.target?.toJSON(["id"]);

    socket.emit(ACTIONS["OBJECT:ROTATING"], { roomId, json });
  }

  function objectRemoveHandler(e: fabric.IEvent<MouseEvent>) {
    const json = e.target?.toJSON(["id"]);

    socket.emit(ACTIONS["OBJECT:REMOVED"], { roomId, json });
  }

  function textChangeHandler(e: any) {
    const json = e.target?.toJSON(["id"]);

    socket.emit(ACTIONS["TEXT:CHANGED"], { roomId, json });
  }

  useEffect(() => {
    if (fabricInst) {
      fabricInst.on("object:moving", objectMoveHandler);
      fabricInst.on("object:scaling", objectScaleHandler);
      fabricInst.on("object:rotating", objectRotateHandler);
      fabricInst.on("object:removed", objectRemoveHandler);
      fabricInst.on("text:changed", textChangeHandler);
    }

    return () => {
      fabricInst?.off("object:moving", objectMoveHandler as any);
      fabricInst?.off("object:scaling", objectScaleHandler as any);
      fabricInst?.off("object:rotating", objectRotateHandler as any);
      fabricInst?.off("object:removed", objectRemoveHandler as any);
      fabricInst?.off("text:changed", textChangeHandler);
    };
  }, [fabricInst]);

  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      return React.cloneElement(child as any, {
        objectAddHandler: objectAddHandler,
      });
    });
  };

  return <>{renderChildren()}</>;
}

export default Dispatcher;
