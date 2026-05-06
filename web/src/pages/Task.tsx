import { useState } from "react";

type TaskItem = {
  id: string;
  task: string;
  completed: boolean;
};

const Task = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (input.trim() === "") return;

    const newTask: TaskItem = {
      id: Date.now().toString(),
      task: input,
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setInput("");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          To-Do App
        </h2>

        {/* Input */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter task..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            Add
          </button>
        </div>

        {/* Tasks */}
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-4 h-4 accent-blue-500 cursor-pointer"
                />

                <span
                  className={`flex-1 ${
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  {task.task}
                </span>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 font-medium transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/* Empty State */}
        {tasks.length === 0 && (
          <p className="text-center text-gray-400 mt-4">No tasks yet 👀</p>
        )}
      </div>
    </div>
  );
};

export default Task;
