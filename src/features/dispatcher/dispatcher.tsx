import { socket } from "@/socket";

import React, { ReactNode, useEffect } from "react";
import { useParams } from "react-router-dom";

interface DispatcherPropTypes {
  fabricInst: fabric.Canvas | null;
  children: ReactNode;
}

function Dispatcher({ children, fabricInst }: DispatcherPropTypes) {
  const { roomId } = useParams();

  function objectAddHandler() {
    const json = fabricInst?.getActiveObject()?.toJSON(["id"]);

    socket.emit("objet:added", { roomId, json });
  }

  useEffect(() => {
    if (fabricInst) {
      fabricInst.on("object:moving", (e: fabric.IEvent<MouseEvent>) => {
        const json = e.target?.toJSON(["id"]);

        socket.emit("moving", { roomId, json });
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

        socket.emit("scaling", { roomId, json });
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

        socket.emit("rotating", { roomId, json });
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

        socket.emit("removed", { roomId, json });
      });
    }

    return () => {
      fabricInst?.off("object:removed");
    };
  }, [fabricInst]);

  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        objectAddHandler: objectAddHandler,
      });
    });
  };

  return <>{renderChildren()}</>;
}

export default Dispatcher;
