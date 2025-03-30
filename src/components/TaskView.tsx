import {
  BotMessageSquareIcon,
  CalendarIcon,
  PlayIcon,
  PlusIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Step from "@/components/Step";
import NavBar from "./NavBar";

type Task = {
  id?: number;
  message: string;
  status: string;
};

export default function TaskView({ taskId }: Readonly<{ taskId?: string }>) {
  const [steps, setSteps] = useState([
    {
      id: 0,
      title: "Visit Zillow.com.",
      description: "Visit Zillow.com.",
    },
    {
      id: 1,
      title: "Search for real estate properties in New York City.",
      description: "Search for real estate properties in New York City.",
    },
    {
      id: 2,
      title: "Filter by price.",
      description: "Filter by price under $500,000.",
    },
    {
      id: 3,
      title: "Save the properties.",
      description: "Save the properties into a JSON list and return.",
    },
  ]);
  const [progress, setProgress] = useState(0);
  const [numStepsBeingEdited, setNumStepsBeingEdited] = useState(0);
  const [task, setTask] = useState<Task | null>(null);
  const [runLoading, setRunLoading] = useState(false);

  const fetchTask = async () => {
    const response = await fetch(
      `https://api.runtaskforce.com/task/test_user/${taskId}`
    );

    if (response.ok) {
      const data = await response.json();
      const task = data.data.task;

      setTask(task);

      if (task?.status === "completed") {
        setProgress(100);
      }
    }
  };

  const runTask = async () => {
    setRunLoading(true);

    const response = await fetch(`https://api.runtaskforce.com/schedule`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: task?.message,
        user_id: "test_user",
        run_at: new Date().valueOf(),
      }),
    });

    setRunLoading(false);

    if (response.ok) {
      const data = await response.json();

      console.log(data);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const moveListItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragItem = steps[dragIndex];
      const hoverItem = steps[hoverIndex];

      setSteps((prev) => {
        const updatedSteps = [...prev];
        updatedSteps[dragIndex] = hoverItem;
        updatedSteps[hoverIndex] = dragItem;

        return updatedSteps;
      });
    },
    [steps]
  );

  const addStep = useCallback(() => {
    setSteps((prev) => [
      ...prev,
      {
        id: prev.length,
        title: "",
        description: "",
      },
    ]);
  }, []);

  const deleteStep = useCallback((index: number) => {
    setSteps((prev) => {
      const updatedSteps = [...prev];
      updatedSteps.splice(index, 1);

      return updatedSteps;
    });
  }, []);

  const getStatusClass = (task: Task | null) => {
    switch (task?.status) {
      case "completed":
        return "status-primary";
      default:
        return "";
    }
  };

  const onSubmitMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const input = form.querySelector("input");
    const message = input?.value || "";

    const task = {
      message,
      status: "pending",
    };

    setTask(task);
  };

  return (
    <div className="h-full flex flex-col">
      <NavBar />
      {task ? (
        <div className="px-16">
          <p className="font-display text-3xl">{task?.message || "Loading…"}</p>
          <progress
            className="progress progress-primary w-[768px] mt-8"
            value={steps.length > 0 ? progress : undefined}
            max="100"
          ></progress>
          <div className="flex items-center gap-2">
            <div className="inline-grid *:[grid-area:1/1]">
              <div
                className={`status ${getStatusClass(task)} animate-ping`}
              ></div>
              <div className={`status ${getStatusClass(task)}`}></div>
            </div>
            <div>
              <b>Status:</b>{" "}
              <span>
                {task?.status
                  ? task?.status.charAt(0).toUpperCase() + task?.status.slice(1)
                  : "Loading…"}
              </span>
            </div>
          </div>
          {task?.status === "completed" && (
            <div className="mt-4">
              <h2 className="text-xl font-bold">Result</h2>
            </div>
          )}
          <ul className="list bg-base-100 rounded-box shadow-md w-[768px] max-h-[512px] overflow-y-scroll mt-8 hidden">
            <li className="p-4 pb-2 tracking-wide flex justify-between items-center">
              <span>Steps</span>
              <button className="btn btn-square btn-ghost" onClick={addStep}>
                <PlusIcon className="size-[1.2em]" />
              </button>
            </li>

            {steps.map((step, index) => {
              return (
                <Step
                  key={step.id}
                  index={index}
                  title={step.title}
                  description={step.description}
                  moveListItem={moveListItem}
                  onEditStart={() => {
                    setNumStepsBeingEdited(numStepsBeingEdited + 1);
                  }}
                  onEditEnd={(index, title, description) => {
                    setSteps((prev) => {
                      const updatedSteps = [...prev];

                      updatedSteps[index] = {
                        ...updatedSteps[index],
                        title,
                        description,
                      };

                      return updatedSteps;
                    });

                    setNumStepsBeingEdited(numStepsBeingEdited - 1);
                  }}
                  onDelete={deleteStep}
                />
              );
            })}
          </ul>
          <div className="mt-8 w-[768px] flex items-center justify-between">
            <div className="text-xs font-bold">
              {numStepsBeingEdited > 0 &&
                "Finish editing the steps to save, schedule, or run the task."}
            </div>
            <div className="ml-auto">
              <button
                className={`btn ${
                  numStepsBeingEdited > 0 ? "btn-disabled" : ""
                }`}
              >
                <PlusIcon className="size-[1.2em]" />
                Save
              </button>
              <button
                className={`btn ${
                  numStepsBeingEdited > 0 ? "btn-disabled" : ""
                } ms-2`}
              >
                <CalendarIcon className="size-[1.2em]" />
                Schedule
              </button>
              <button
                className={`btn btn-primary ${
                  numStepsBeingEdited > 0 || runLoading ? "btn-disabled" : ""
                } ms-2`}
                onClick={runTask}
              >
                <PlayIcon className="size-[1.2em]" />
                Run
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full grow-1">
          <div className="flex flex-col gap-4 w-[768px]">
            <h1 className="text-4xl font-bold">Welcome, Zach</h1>
            <div>
              <form onSubmit={onSubmitMessage}>
                <label className="input input-xl w-full">
                  <BotMessageSquareIcon />
                  <input
                    type="input"
                    required
                    placeholder="What do you want to get done?"
                  />
                </label>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
