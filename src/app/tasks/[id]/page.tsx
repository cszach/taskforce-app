"use client";

import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import { MouseEvent as ReactMouseEvent, use, useEffect, useState } from "react";
import TaskView from "@/components/TaskView";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Link from "next/link";

type Task = {
  id?: number;
  message: string;
  status: string;
};

export default function Tasks({
  params,
}: Readonly<{ params?: Promise<{ id?: string }> }>) {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const response = await fetch(
      "https://api.runtaskforce.com/tasks/test_user?include_completed=true"
    );

    if (response.ok) {
      const data = await response.json();
      const tasks = data.data.tasks;

      console.log(tasks);

      setTasks(tasks || []);
    }
  };

  const onFilter = (e: ReactMouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const { id } = params ? use(params) : {};

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex">
        <div className="drawer drawer-open">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content w-full h-full">
            <TaskView taskId={id} />
          </div>
          <div className="drawer-side">
            <div className="flex flex-col bg-base-200 min-h-full w-80 p-4 gap-8">
              <div className="flex flex-col gap-2">
                <Link href="/" className="btn btn-primary btn-block">
                  New task
                </Link>
                <div className="flex">
                  <label className="input">
                    <SearchIcon className="opacity-50" />
                    <input
                      type="search"
                      className="grow"
                      placeholder="Search"
                    />
                    <SlidersHorizontalIcon
                      className="cursor-pointer"
                      onClick={onFilter}
                    />
                  </label>
                </div>
              </div>
              <ul className="menu w-full p-0">
                {tasks.map((task: Task) => (
                  <li key={task.id} className="flex items-center gap-2">
                    <a href={`/tasks/${task.id}`}>
                      <div className="grow-1 text-nowrap text-ellipsis overflow-x-hidden relative">
                        <span>{task.message}</span>
                      </div>
                      <span
                        className={`status ${
                          task.status === "completed" ? "status-primary" : ""
                        }`}
                      ></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
