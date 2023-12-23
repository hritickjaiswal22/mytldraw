import useWindowResize from "@/hooks/useWindowResize";
import NonInteractiveHeader from "@/layouts/header";
import RadioGroup from "@/components/styledRadioGroup";
import Drawer from "@/features/drawer";
import { socket } from "@/socket";
import { DrawOptions } from "@/utils/drawOptions";
import { BaseTextOptions } from "@/utils/baseObjectOptions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Image,
  Trash2,
  MousePointer,
  Square,
  Triangle,
  Circle,
  ArrowRight,
  Minus,
  Edit2,
  Type,
} from "react-feather";
import imageCompression from "browser-image-compression";
import { Label } from "@/components/ui/label";

const PRIMARYPURPLE = "#5b57d1";

function Editor() {
  const [fabricInst, setFabricInst] = useState<fabric.Canvas | null>(null);
  const canvasRef = useRef(null);
  const { windowHeight, windowWidth } = useWindowResize();

  const [drawOption, setDrawOption] = useState(0);
  const [imageBase64Url, setImageBase64Url] = useState<string | null>(null);

  function objectAddHandler() {
    const obj = fabricInst?.getActiveObject();

    socket.emit("objet:added", obj?.toJSON(["id"]));
  }

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

    temp.freeDrawingBrush.width = 5;
    temp.freeDrawingBrush.color = "#000";

    // To load "Virgil" font without installing fontFaceObserver
    const dummyText = new fabric.Text("", {
      ...BaseTextOptions,
      fontSize: 0,
    });
    temp.add(dummyText);
    temp.renderAll();
    temp.remove(dummyText);

    setFabricInst(temp);
  }, []);

  useEffect(() => {
    fabricInst?.setWidth(windowWidth);
    fabricInst?.setHeight(windowHeight);
  }, [windowHeight, windowWidth]);

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
      fabricInst.on("object:moving", (e: fabric.IEvent<MouseEvent>) => {
        const json = e.target?.toJSON(["id"]);

        socket.emit("moving", json);
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
      if (drawOption === DrawOptions.FREEHAND) fabricInst.isDrawingMode = true;
      else fabricInst.isDrawingMode = false;
    }
  }, [fabricInst, drawOption]);

  function optionHandler(option: number) {
    setDrawOption(option);
  }

  return (
    <>
      <NonInteractiveHeader>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="pointer-events-auto w-[36px] h-[36px] rounded-[10px] p-[10px] flex justify-center items-center bg-[#ececf4] hover:bg-[#f1f0ff]"
              variant="outline"
            >
              <Menu width={16} height={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 translate-x-4 border-0 shadow-none border-none">
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex gap-3 font-normal cursor-pointer hover:bg-[#f1f0ff] text-xs">
                <Image width={16} height={16} />
                Export image
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-3 font-normal cursor-pointer hover:bg-[#f1f0ff] text-xs">
                <Trash2 width={16} height={16} />
                Reset the canvas
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="pointer-events-none flex items-center gap-1 p-1 rounded bg-white">
          <RadioGroup
            onClickHandler={optionHandler}
            options={[
              {
                id: "1",
                content: <MousePointer width={16} height={16} />,
                value: "1",
              },
              {
                id: "2",
                content: <Square width={16} height={16} />,
                value: "2",
              },
              {
                id: "3",
                content: <Triangle width={16} height={16} />,
                value: "3",
              },
              {
                id: "4",
                content: <Circle width={16} height={16} />,
                value: "4",
              },
              {
                id: "5",
                content: <ArrowRight width={16} height={16} />,
                value: "5",
              },
              {
                id: "6",
                content: <Minus width={16} height={16} />,
                value: "6",
              },
              {
                id: "7",
                content: <Edit2 width={16} height={16} />,
                value: "7",
              },
              {
                id: "8",
                content: <Type width={16} height={16} />,
                value: "8",
              },
            ]}
            drawOption={drawOption}
          />
          <div className="pointer-events-auto">
            <input
              className="hidden"
              onChange={onImageUpload}
              type="file"
              accept="image/png, image/gif, image/jpeg"
              id="image-upload"
            />
            <Label
              htmlFor="image-upload"
              className={`w-[36px] h-[36px] rounded-[10px] flex justify-center items-center bg-white hover:bg-[#f1f0ff] cursor-pointer ${
                drawOption === DrawOptions.IMAGE ? "bg-[#bebce5]" : "bg-white"
              }`}
            >
              <Image width={16} height={16} />
            </Label>
          </div>
        </div>

        <div></div>
      </NonInteractiveHeader>
      <main>
        <Drawer
          objectAddHandler={objectAddHandler}
          drawOption={drawOption}
          fabricInst={fabricInst}
          imageBase64Url={imageBase64Url}
          setImageBase64Url={setImageBase64Url}
        >
          <canvas ref={canvasRef}></canvas>
        </Drawer>
      </main>
    </>
  );
}

export default Editor;
