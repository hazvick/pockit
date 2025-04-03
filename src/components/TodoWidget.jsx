import React, { useState, Fragment } from "react";
import {
  MoreHorizontal,
  Calendar,
  Edit,
  Bell,
  Eye,
  Trash,
  CheckCircle,
  XCircle,
  Filter,
  Plus,
} from "lucide-react";
import { Menu, Transition, Dialog } from "@headlessui/react";

export default function TodoWidget() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Ta tvätten",
      tags: ["Tvätt", "Badrum"],
      users: ["/public/assets/mathias.jpg"],
      deadline: null,
      status: "active",
    },
    {
      id: 2,
      title: "Bygga träramp",
      tags: ["DIY", "Bygga", "Boss"],
      users: [
        "/public/assets/mathias.jpg",
        "/public/assets/niki.png",
        "/public/assets/boss.png",
      ],
      deadline: "4 dagar",
      status: "upcoming",
    },
  ]);
  const [filter, setFilter] = useState("all");

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  const handleDelete = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const handleStatus = (id, status) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));

  const filteredTasks = tasks.filter((t) =>
    filter === "all" ? true : t.status === filter
  );

  const handleAddTask = () => {
    const task = {
      id: Date.now(),
      title: newTitle.trim(),
      tags: newTags.split(",").map((t) => t.trim()).filter(Boolean),
      deadline: newDeadline.trim() || null,
      users: ["/public/assets/mathias.jpg"],
      status: "active",
    };
    setTasks((prev) => [...prev, task]);
    setNewTitle("");
    setNewTags("");
    setNewDeadline("");
    setIsOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow p-6 min-h-[200px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            📝 To Do{" "}
            <span className="text-gray-400 text-sm">({filteredTasks.length})</span>
          </h2>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
            >
              <Plus size={16} /> Lägg till
            </button>

            <Menu as="div" className="relative">
              <Menu.Button className="text-sm text-gray-600 hover:text-black flex items-center gap-1">
                <Filter size={16} /> Filter
              </Menu.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Menu.Items className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow z-10 text-sm">
                  {["all", "active", "upcoming", "done", "cancelled"].map((f) => (
                    <Menu.Item key={f}>
                      {({ active }) => (
                        <button
                          onClick={() => setFilter(f)}
                          className={`w-full text-left px-3 py-2 ${
                            active ? "bg-gray-100" : ""
                          }`}
                        >
                          {f === "all"
                            ? "Alla"
                            : f === "upcoming"
                            ? "Kommande"
                            : f === "done"
                            ? "Klara"
                            : f === "cancelled"
                            ? "Avbrutna"
                            : "Aktiva"}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        <div className="overflow-y-auto pr-1" style={{ maxHeight: "280px" }}>
          {filteredTasks.map((task) => (
            <div key={task.id} className="p-4 mb-2 border-b relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[13px] font-semibold">{task.title}</h3>
                    {task.status === "done" && (
                      <CheckCircle className="text-green-500 w-3 h-3" />
                    )}
                    {task.status === "cancelled" && (
                      <XCircle className="text-red-500 w-3 h-3" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {task.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-200 text-[9px] px-2 py-1 rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                    {task.deadline && (
                      <div className="flex items-center text-[9px] text-green-600 bg-green-100 px-2 py-1 rounded-lg w-fit">
                        <Calendar className="w-2.5 h-2.5 mr-1" /> {task.deadline}
                      </div>
                    )}
                  </div>
                </div>

                <Menu as="div" className="relative">
                  <Menu.Button className="text-gray-500 hover:text-black">
                    <MoreHorizontal size={18} />
                  </Menu.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg text-sm z-20">
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() => handleStatus(task.id, "done")}
                            className={`flex items-center px-3 py-2 cursor-pointer ${
                              active ? "bg-green-100" : ""
                            }`}
                          >
                            ✅ Markera som klar
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() => handleStatus(task.id, "cancelled")}
                            className={`flex items-center px-3 py-2 cursor-pointer ${
                              active ? "bg-red-100" : ""
                            }`}
                          >
                            ❌ Avbryt
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div className={`flex items-center px-3 py-2 ${active ? "bg-gray-100" : ""}`}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div className={`flex items-center px-3 py-2 ${active ? "bg-gray-100" : ""}`}>
                            <Bell className="w-4 h-4 mr-2" /> Påminn
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div className={`flex items-center px-3 py-2 ${active ? "bg-gray-100" : ""}`}>
                            <Eye className="w-4 h-4 mr-2" /> Visa aktivitet
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() => handleDelete(task.id)}
                            className={`flex items-center px-3 py-2 text-red-500 cursor-pointer ${
                              active ? "bg-red-100" : ""
                            }`}
                          >
                            <Trash className="w-4 h-4 mr-2" /> Ta bort
                          </div>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>

              <div className="flex -space-x-2">
                {task.users.slice(0, 3).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="user"
                    className="w-6 h-6 object-cover rounded-full border-2 border-white"
                  />
                ))}
                {task.users.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-gray-300 text-xs flex items-center justify-center border-2 border-white">
                    +{task.users.length - 3}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
                  <Dialog.Title className="font-semibold text-lg mb-4">
                    🆕 Ny uppgift
                  </Dialog.Title>

                  <div className="space-y-4 text-sm">
                    <div>
                      <label className="block mb-1 font-medium">Titel:</label>
                      <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Vad ska göras?"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Taggar (komma-separerade):</label>
                      <input
                        value={newTags}
                        onChange={(e) => setNewTags(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="t.ex. hem, städning"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Deadline (valfri):</label>
                      <input
                        value={newDeadline}
                        onChange={(e) => setNewDeadline(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="t.ex. 2 dagar, fredag"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-sm text-gray-500"
                    >
                      Avbryt
                    </button>
                    <button
                      onClick={handleAddTask}
                      className="bg-blue-600 text-white px-4 py-2 text-sm rounded"
                    >
                      Lägg till
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
