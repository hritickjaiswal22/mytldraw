/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import useWindowResize from "@/hooks/useWindowResize";

import Drawer from "@/features/drawer";
import { DrawOptions } from "@/utils/drawOptions";
import { BaseTextOptions } from "@/utils/baseObjectOptions";

import Dispatcher from "@/features/dispatcher";
import Receiver from "@/features/receiver";
import { socket } from "@/socket";
import { ACTIONS } from "@/utils/actions";
import {
  FONT_SIZE_OPTIONS,
  STATIC_BACKGROUND_COLORS,
  STATIC_STROKE_COLORS,
  STATIC_TEXT_ALIGN_OPTIONS,
  getFontSize,
} from "@/utils/miscellaneous";
// Contexts
import { ObjectPropertiesContext } from "@/contexts/objectProperties";
import { TextPropertiesContext } from "@/contexts/textProperties";
import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";

import OptionsSidebar from "@/features/sidebar";
import Header from "@/features/header";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const PRIMARYPURPLE = "#5b57d1";

interface ActiveUserType {
  username: string;
  socketId: string;
}

function Editor() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [fabricInst, setFabricInst] = useState<fabric.Canvas | null>(null);
  const canvasRef = useRef(null);
  const { windowHeight, windowWidth } = useWindowResize();
  const [, setActiveUsers] = useState<Array<ActiveUserType>>([]);

  const [drawOption, setDrawOption] = useState(0);
  const [imageBase64Url, setImageBase64Url] = useState<string | null>(null);

  const [objectProperties, setObjectProperties] = useState({
    strokeWidth: 2,
    stroke: STATIC_STROKE_COLORS[0],
    fill: STATIC_BACKGROUND_COLORS[0],
    strokeDashArray: undefined,
    opacity: 1,
  });
  const [textProperties, setTextProperties] = useState({
    fontSize: getFontSize(FONT_SIZE_OPTIONS.MEDIUM),
    fontFamily: "system-ui",
    textAlign: STATIC_TEXT_ALIGN_OPTIONS[0],
  });

  const [keepCurrentDrawOption, setKeepCurrentDrawOption] = useState(false);

  async function onImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setImageBase64Url(null);
    const imageFile = (e as any).target.files[0];
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 720,
      useWebWorker: true,
    };

    if (fabricInst) {
      try {
        fabricInst.defaultCursor = "wait";
        const compressedFile = await imageCompression(imageFile, options);
        const reader = new FileReader();

        reader.onload = function (event) {
          setImageBase64Url((event as any).target.result);
          setDrawOption(DrawOptions.IMAGE);
          fabricInst.defaultCursor = "default";
        };

        reader.readAsDataURL(compressedFile);
      } catch (error) {
        fabricInst.defaultCursor = "default";
        console.log(error);
      }
    }
  }

  useEffect(() => {
    function initConnection() {
      socket.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socket.on(ACTIONS.NEWUSERJOINED, ({ clients, username }) => {
        console.log(`User ${username} joined`);

        setActiveUsers(clients);
      });

      socket.on(ACTIONS.DISCONNECTED, ({ username, socketId }) => {
        console.log(`User ${username} left`);
        setActiveUsers((prev) =>
          prev.filter((activeUser) => activeUser.socketId !== socketId)
        );
      });
    }

    if (location.state && location.state?.username) initConnection();
    else navigate("/");

    return () => {
      socket.off(ACTIONS.NEWUSERJOINED);
      socket.off(ACTIONS.DISCONNECTED);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const temp = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
    });
    fabric.Object.prototype.cornerStyle = "circle";
    fabric.Object.prototype.cornerSize = 8;
    fabric.Object.prototype.cornerStrokeColor = PRIMARYPURPLE;
    fabric.Object.prototype.cornerColor = "white";
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.borderColor = PRIMARYPURPLE;
    fabric.Object.prototype.padding = 4;
    fabric.Object.prototype.strokeUniform = true;

    temp.freeDrawingBrush.width = 5;
    temp.freeDrawingBrush.color = "#000";

    temp.preserveObjectStacking = true;

    // To load "Virgil" font without installing fontFaceObserver
    const dummyText = new fabric.Text("", {
      ...BaseTextOptions,
      fontSize: 0,
    });
    temp.add(dummyText);
    temp.renderAll();
    temp.remove(dummyText);

    // Adding snap lines
    const verticalSnapLine = new fabric.Rect({
      stroke: "#fa5555",
      strokeWidth: 1,
      opacity: 0.5,
      width: 1,
      height: window.innerHeight,
      padding: 0,
      selectable: false,
      visible: false,
    });
    Object.assign(verticalSnapLine, { id: "vertical-snap-line" });
    temp.add(verticalSnapLine);

    const horizontalSnapLine = new fabric.Rect({
      stroke: "#fa5555",
      fill: "#fa5555",
      strokeWidth: 1,
      opacity: 0.5,
      width: window.innerWidth,
      height: 1,
      padding: 0,
      selectable: false,
      visible: false,
    });
    Object.assign(horizontalSnapLine, { id: "horizontal-snap-line" });
    temp.add(horizontalSnapLine);

    setFabricInst(temp);
  }, []);

  useEffect(() => {
    fabricInst?.setWidth(windowWidth);
    fabricInst?.setHeight(windowHeight);

    fabricInst?._objects.forEach((obj) => {
      if ((obj as any).id === "horizontal-snap-line")
        obj.set({
          width: windowWidth,
        });

      if ((obj as any).id === "vertical-snap-line")
        obj.set({
          height: windowHeight,
        });
    });
  }, [windowHeight, windowWidth]);

  useEffect(() => {
    if (fabricInst) {
      if (drawOption === DrawOptions.FREEHAND) fabricInst.isDrawingMode = true;
      else fabricInst.isDrawingMode = false;
    }
  }, [fabricInst, drawOption]);

  function optionHandler(option: number) {
    setDrawOption(option);
  }

  // Contexts Value
  const objectPropertiesContextValue = {
    objectProperties,
    setObjectProperties,
  };

  const textPropertiesContextValue = {
    textProperties,
    setTextProperties,
  };

  const fabricCanvasContextValue = {
    fabricInst,
  };

  return (
    <FabricCanvasContext.Provider value={fabricCanvasContextValue}>
      <Header
        drawOption={drawOption}
        onImageUpload={onImageUpload}
        optionHandler={optionHandler}
        keepCurrentDrawOption={keepCurrentDrawOption}
        setKeepCurrentDrawOption={setKeepCurrentDrawOption}
      />

      <TextPropertiesContext.Provider value={textPropertiesContextValue}>
        <ObjectPropertiesContext.Provider value={objectPropertiesContextValue}>
          {/* Main Canvas */}
          <main>
            <Receiver>
              {/* Dispatcher must be the direct parent of Drawer as it is passing down
                objectAddHandler as props to Drawer */}
              <Dispatcher>
                <Drawer
                  drawOption={drawOption}
                  setDrawOption={setDrawOption}
                  imageBase64Url={imageBase64Url}
                  setImageBase64Url={setImageBase64Url}
                  keepCurrentDrawOption={keepCurrentDrawOption}
                >
                  <canvas ref={canvasRef}></canvas>
                </Drawer>
              </Dispatcher>
            </Receiver>
          </main>
          {/* Options Sidebar */}
          {fabricInst && <OptionsSidebar />}
        </ObjectPropertiesContext.Provider>
      </TextPropertiesContext.Provider>
    </FabricCanvasContext.Provider>
  );
}

export default Editor;
