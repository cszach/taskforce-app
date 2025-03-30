import {
  CheckIcon,
  CircleIcon,
  GripVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd";

export default function Step({
  index,
  title,
  description,
  moveListItem,
  onEditStart,
  onEditEnd,
  onDelete,
}: Readonly<{
  index: number;
  title: string;
  description: string;
  moveListItem: (dragIndex: number, hoverIndex: number) => void;
  onEditStart: (index: number) => void;
  onEditEnd: (index: number, title: string, description: string) => void;
  onDelete: (index: number) => void;
}>) {
  const [editing, setEditing] = useState(false);

  const [, dragRef] = useDrag(() => ({
    type: "STEP",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, dropRef] = useDrop(() => ({
    accept: "STEP",
    hover: (
      item: { index: number },
      monitor: DropTargetMonitor<{ index: number }, unknown>
    ) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      // @ts-expect-error - ref is not null
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // @ts-expect-error - monitor is not null
      const hoverActualY = monitor.getClientOffset().y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return;

      moveListItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  }));

  const ref = useRef(null);
  const dragDropRef = dragRef(dropRef(ref));

  return (
    // @ts-expect-error - ref is not null
    <li ref={dragDropRef} className="list-row items-center gap-y-0">
      <div className="flex items-center relative">
        <CircleIcon className="hidden" />
        <GripVerticalIcon className="opacity-60 size-4 hover:cursor-grab" />
      </div>
      <CircleIcon />
      <div className="list-col-grow">
        {editing ? (
          <input type="text" className="input input-sm" defaultValue={title} />
        ) : (
          <div>{title}</div>
        )}
      </div>
      <div className="list-col-wrap">
        {editing ? (
          <textarea
            className="textarea textarea-sm mt-1"
            defaultValue={description}
          ></textarea>
        ) : (
          <div className="text-xs opacity-60">{description}</div>
        )}
      </div>
      <button
        className="btn btn-square btn-ghost"
        onClick={() => {
          if (editing) {
            // @ts-expect-error - ref is not null
            const title = ref.current.querySelector("input").value;
            // @ts-expect-error - ref is not null
            const description = ref.current.querySelector("textarea").value;

            onEditEnd(index, title, description);
          } else {
            onEditStart(index);
          }

          setEditing(!editing);
        }}
      >
        {editing ? (
          <CheckIcon className="size-[1.2em]" />
        ) : (
          <PencilIcon className="size-[1.2em]" />
        )}
      </button>
      <button
        className="btn btn-square btn-ghost"
        onClick={() => onDelete(index)}
      >
        <TrashIcon className="size-[1.2em]" />
      </button>
    </li>
  );
}
