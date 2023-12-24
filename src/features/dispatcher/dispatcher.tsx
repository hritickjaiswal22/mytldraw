import { socket } from "@/socket";

import React, { ReactNode, useEffect } from "react";

interface DispatcherPropTypes {
  fabricInst: fabric.Canvas | null;
  children: ReactNode;
}

function Dispatcher({ children, fabricInst }: DispatcherPropTypes) {
  function objectAddHandler() {
    const obj = fabricInst?.getActiveObject();

    socket.emit("objet:added", obj?.toJSON(["id"]));
  }

  useEffect(() => {
    if (fabricInst) {
      fabricInst.on("object:moving", (e: fabric.IEvent<MouseEvent>) => {
        const json = e.target?.toJSON(["id"]);

        socket.emit("moving", json);
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

        socket.emit("scaling", json);
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

        socket.emit("rotating", json);
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

        socket.emit("removed", json);
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
