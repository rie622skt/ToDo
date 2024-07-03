"use client";
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlusCircle, faUndoAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function MainComponent() {
  const [tasks, setTasks] = React.useState([]);
  const [showPopup, setShowPopup] = React.useState(false);
  const [newTask, setNewTask] = React.useState({
    name: "",
    description: "",
    dueDate: "",
    dueTime: "",
    priority: "none",
  });
  const [sortType, setSortType] = React.useState("date");
  const [filterPriority, setFilterPriority] = React.useState("all");
  const [showCompleted, setShowCompleted] = React.useState(true);

  const addTask = () => {
    const task = {
      ...newTask,
      id: Date.now(),
      dueDate: newTask.dueDate || new Date().toISOString().split("T")[0],
      dueTime: newTask.dueTime || "23:59",
      completed: false,
    };
    setTasks([...tasks, task]);
    setShowPopup(false);
    setNewTask({
      name: "",
      description: "",
      dueDate: "",
      dueTime: "",
      priority: "none",
    });
  };

  const deleteTask = (id) => {
    if (window.confirm("削除してもよろしいですか？")) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const completeTask = (id) => {
    const task = tasks.find((task) => task.id === id);
    const confirmMessage = task.completed ? "未完了に戻してもよろしいですか？" : "完了にしてもよろしいですか？";
    if (window.confirm(confirmMessage)) {
      setTasks(tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    }
  };

  const filterAndSortTasks = () => {
    let filteredTasks =
      filterPriority === "all"
        ? tasks
        : tasks.filter((task) => task.priority === filterPriority);
    filteredTasks = filteredTasks.sort((a, b) => {
      if (sortType === "date") {
        return (
          new Date(a.dueDate + "T" + a.dueTime) -
          new Date(b.dueDate + "T" + b.dueTime)
        );
      } else if (sortType === "priority") {
        const priorities = { high: 1, medium: 2, low: 3, none: 4 };
        return priorities[a.priority] - priorities[b.priority];
      }
      return a.id - b.id;
    });
    return showCompleted
      ? filteredTasks.sort((a, b) => b.completed - a.completed)
      : filteredTasks.sort((a, b) => a.completed - b.completed);
  };

  const renderPriority = (priority) => {
    switch (priority) {
      case "high":
        return "高";
      case "medium":
        return "中";
      case "low":
        return "低";
      default:
        return "なし";
    }
  };

  const renderTaskBackground = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-300";
      case "medium":
        return "bg-yellow-300";
      case "low":
        return "bg-green-300";
      default:
        return "bg-gray-200";
    }
  };

  const renderTaskOpacity = (completed) => (completed ? "opacity-50" : "");

  return (
    <div className="p-4 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">To-Doリスト</h1>
        <button
          onClick={() => setShowPopup(true)}
          className="text-white bg-blue-500 px-4 py-2 rounded fa fa-plus"
        >
          <FontAwesomeIcon icon={faPlusCircle} /> 
        </button>
      </div>
      <div className="mb-4">
        <label className="block mb-2">優先度フィルタ:</label>
        <select
          name="filterPriority"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="all">すべて</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
          <option value="none">なし</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">並び順:</label>
        <select
          name="sortType"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="date">締め切り順</option>
          <option value="priority">優先度順</option>
          <option value="id">追加順</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">完了済み/未完了:</label>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="border p-2 rounded w-full"
        >
          {showCompleted ? "完了済みを上に" : "未完了を上に"}
        </button>
      </div>
      <div>
        {filterAndSortTasks().map((task) => (
          <div
            key={task.id}
            className={`${renderTaskBackground(
              task.priority
            )} ${renderTaskOpacity(task.completed)} p-4 mb-2 rounded`}
          >
            <h2 className="text-lg font-bold">{task.name}</h2>
            <p>{task.description}</p>
            <p>
              締め切り: {task.dueDate} {task.dueTime}
            </p>
            <p>優先度: {renderPriority(task.priority)}</p>
            <div className="flex justify-between">
              <button
                onClick={() => completeTask(task.id)}
                className={`text-white px-2 py-1 rounded ${
                  task.completed ? "bg-yellow-500" : "bg-green-500"
                }`}
              >
                <FontAwesomeIcon icon={task.completed ? faUndoAlt : faCheck} />
                {task.completed ? "未完了に戻す" : "完了"}
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-white bg-red-500 px-2 py-1 rounded"
              >
                <FontAwesomeIcon icon={faTrashAlt} />
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded w-[600px] max-w-full">
            <h2 className="text-xl mb-4">新しいタスク</h2>
            <label className="block mb-2">タスク名</label>
            <input
              type="text"
              name="name"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              className="border p-2 rounded w-full mb-4"
            />
            <label className="block mb-2">説明</label>
            <textarea
              name="description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            ></textarea>
            <label className="block mb-2">締め切り日</label>
            <input
              type="date"
              name="dueDate"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            />
            <label className="block mb-2">締め切り時間</label>
            <input
              type="time"
              name="dueTime"
              value={newTask.dueTime}
              onChange={(e) =>
                setNewTask({ ...newTask, dueTime: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            />
            <label className="block mb-2">優先度</label>
            <select
              name="priority"
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            >
              <option value="none">なし</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
            <button
              onClick={addTask}
              className="text-white bg-blue-500 px-4 py-2 rounded mr-2"
            >
              追加
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="text-white bg-gray-500 px-4 py-2 rounded"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;
