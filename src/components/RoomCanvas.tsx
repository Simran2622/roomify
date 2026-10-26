import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Group, Image as KonvaImage, Layer, Rect, Stage, Text, Transformer, Circle, Line } from "react-konva";
import type { FurnitureElement } from "../types";
import { getFurnitureDefinition } from "../data/furniture";

interface Props {
  roomImage: string;
  elements: FurnitureElement[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (id: string, changes: Partial<FurnitureElement>) => void;
  stageRef: React.MutableRefObject<Konva.Stage | null>;
}

function useImage(src: string) {
  const [image, setImage] = useState<HTMLImageElement | undefined>();
  useEffect(() => {
    if (!src) { setImage(undefined); return; }
    const img = new window.Image();
    img.onload = () => setImage(img);
    img.src = src;
  }, [src]);
  return image;
}

function FurnitureShape({
  element, selected, onSelect, onChange
}: {
  element: FurnitureElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (changes: Partial<FurnitureElement>) => void;
}) {
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const definition = getFurnitureDefinition(element.type);

  useEffect(() => {
    if (selected && groupRef.current && transformerRef.current) {
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selected]);

  const scaleToSize = () => {
    const node = groupRef.current;
    if (!node) return;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    onChange({
      x: node.x(),
      y: node.y(),
      width: Math.max(20, element.width * scaleX),
      height: Math.max(20, element.height * scaleY),
      rotation: node.rotation(),
    });
  };

  const renderShape = () => {
    const fill = element.color;
    switch (element.type) {
      case "sofa":
        return <><Rect width={element.width} height={element.height} cornerRadius={16} fill={fill}/><Rect x={10} y={10} width={element.width-20} height={element.height*.35} cornerRadius={10} fill="rgba(255,255,255,.18)"/></>;
      case "bed":
        return <><Rect width={element.width} height={element.height} cornerRadius={10} fill={fill}/><Rect x={10} y={10} width={element.width-20} height={38} cornerRadius={8} fill="#F5F1EA"/><Line points={[element.width/2, 50, element.width/2, element.height-10]} stroke="rgba(80,65,50,.18)" strokeWidth={2}/></>;
      case "chair":
        return <><Rect x={12} y={10} width={element.width-24} height={element.height-10} cornerRadius={20} fill={fill}/><Rect x={20} y={20} width={element.width-40} height={30} cornerRadius={12} fill="rgba(255,255,255,.18)"/></>;
      case "table":
        return <><Rect width={element.width} height={element.height*.3} cornerRadius={12} fill={fill}/><Rect x={12} y={element.height*.28} width={8} height={element.height*.7} fill={fill}/><Rect x={element.width-20} y={element.height*.28} width={8} height={element.height*.7} fill={fill}/></>;
      case "desk":
        return <><Rect width={element.width} height={element.height*.25} cornerRadius={8} fill={fill}/><Rect x={12} y={element.height*.2} width={8} height={element.height*.8} fill={fill}/><Rect x={element.width-20} y={element.height*.2} width={8} height={element.height*.8} fill={fill}/></>;
      case "plant":
        return <><Rect x={20} y={element.height-32} width={element.width-40} height={25} cornerRadius={5} fill="#A87953"/><Circle x={element.width/2} y={40} radius={30} fill={fill}/><Circle x={20} y={55} radius={18} fill={fill}/><Circle x={element.width-20} y={58} radius={18} fill={fill}/><Line points={[element.width/2, element.height-28, element.width/2, 48]} stroke="#557052" strokeWidth={5}/></>;
      case "lamp":
        return <><Rect x={element.width/2-3} y={35} width={6} height={element.height-45} fill={fill}/><Circle x={element.width/2} y={element.height-6} radius={8} fill={fill}/><Line points={[10, 36, element.width-10, 36, element.width/2, 5, 10, 36]} closed fill={fill}/></>;
      case "painting":
        return <><Rect width={element.width} height={element.height} fill="#5D5147"/><Rect x={7} y={7} width={element.width-14} height={element.height-14} fill={fill}/><Circle x={element.width*.7} y={element.height*.35} radius={12} fill="#E9D9B9"/></>;
      case "rug":
        return <><Rect width={element.width} height={element.height} cornerRadius={28} fill={fill} opacity={.8}/><Rect x={15} y={15} width={element.width-30} height={element.height-30} cornerRadius={20} stroke="#EADCCB" strokeWidth={4} dash={[8,5]}/></>;
      default:
        return <Rect width={element.width} height={element.height} fill={fill}/>;
    }
  };

  return (
    <>
      <Group
        ref={groupRef}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        draggable
        onClick={(e) => { e.cancelBubble = true; onSelect(); }}
        onTap={(e) => { e.cancelBubble = true; onSelect(); }}
        onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
        onTransformEnd={scaleToSize}
      >
        {renderShape()}
        <Text
          text={definition?.name ?? element.type}
          width={element.width}
          y={element.height / 2 - 7}
          align="center"
          fontSize={11}
          fill="rgba(38,37,34,.6)"
          listening={false}
        />
      </Group>
      {selected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled
          enabledAnchors={["top-left","top-right","bottom-left","bottom-right"]}
          boundBoxFunc={(oldBox, newBox) =>
            newBox.width < 30 || newBox.height < 30 ? oldBox : newBox
          }
        />
      )}
    </>
  );
}

export default function RoomCanvas({ roomImage, elements, selectedId, onSelect, onChange, stageRef }: Props) {
  const image = useImage(roomImage);
  const width = 900;
  const height = 570;

  return (
    <div className="canvas-grid flex min-h-[520px] flex-1 items-center justify-center overflow-auto p-5 lg:p-8 editor-height">
      <Stage
        ref={(node) => { stageRef.current = node; }}
        width={width}
        height={height}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) onSelect(null);
        }}
        onTouchStart={(e) => {
          if (e.target === e.target.getStage()) onSelect(null);
        }}
        className="max-w-full rounded-2xl shadow-2xl"
      >
        <Layer>
          {image ? (
            <KonvaImage image={image} width={width} height={height} listening={false} />
          ) : (
            <Rect width={width} height={height} fill="#EDE8DE" />
          )}
          {elements.map((element) => (
            <FurnitureShape
              key={element.id}
              element={element}
              selected={selectedId === element.id}
              onSelect={() => onSelect(element.id)}
              onChange={(changes) => onChange(element.id, changes)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
