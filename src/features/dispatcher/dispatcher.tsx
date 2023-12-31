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

  useEffect(() => {
    if (fabricInst) {
      fabricInst.on("object:moving", (e: fabric.IEvent<MouseEvent>) => {
        const json = e.target?.toJSON(["id"]);

        socket.emit(ACTIONS["OBJECT:MOVING"], { roomId, json });
      });
    }

    return () => {
      fabricInst?.off("object:moving");
    };
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      fabricInst.on("object:scaling", (e: fabric.IEvent<MouseEvent>) => {
        const json = e.target?.toJSON(["id"]);

        socket.emit(ACTIONS["OBJECT:SCALING"], { roomId, json });
      });
    }

    return () => {
      fabricInst?.off("object:scaling");
    };
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      fabricInst.on("object:rotating", (e: fabric.IEvent<MouseEvent>) => {
        const json = e.target?.toJSON(["id"]);

        socket.emit(ACTIONS["OBJECT:ROTATING"], { roomId, json });
      });
    }

    return () => {
      fabricInst?.off("object:rotating");
    };
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      fabricInst.on("object:removed", (e: fabric.IEvent<MouseEvent>) => {
        const json = e.target?.toJSON(["id"]);

        socket.emit(ACTIONS["OBJECT:REMOVED"], { roomId, json });
      });
    }

    return () => {
      fabricInst?.off("object:removed");
    };
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      fabricInst.on("text:changed", (e: any) => {
        const json = e.target?.toJSON(["id"]);

        socket.emit(ACTIONS["TEXT:CHANGED"], { roomId, json });
      });
    }

    return () => {
      fabricInst?.off("text:changed");
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
