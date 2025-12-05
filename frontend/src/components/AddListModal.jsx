import { useState } from "react";
import { api } from "../api";
import { useLanguage } from "../hooks/useLanguage";

export default function AddListModal({ onClose, onCreated }) {
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [shared, setShared] = useState([]);
  const [items, setItems] = useState([]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        name: "",
        description: "",
        quantity: 1,
        isOpen: true,
      },
    ]);
  };

  const updateItem = (id, changes) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...changes } : i)));
  };

  const saveItem = (id) => updateItem(id, { isOpen: false });

  const cancelItem = (id) => {
    const it = items.find((i) => i.id === id);
    if (!it.name.trim() && !it.description.trim()) {
      setItems(items.filter((i) => i.id !== id));
    } else updateItem(id, { isOpen: false });
  };

  const addSharedUser = () => {
    if (!email.trim()) return;
    if (!shared.includes(email.trim())) setShared([...shared, email.trim()]);
    setEmail("");
  };

  const saveList = async () => {
    if (!name.trim()) return alert(t.listName + " missing");

    try {
      const list = await api.createList(name);

      for (const userEmail of shared) await api.shareList(list._id, userEmail);

      for (const it of items) {
        if (!it.name.trim()) continue;
        await api.addItem(list._id, it.name, it.description, it.quantity);
      }

      onCreated();
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-fadeIn">

      {/* MODAL CARD */}
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-slideUp">

        {/* HEADER */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            {t.addListTitle}
          </h2>
        </div>

        <div className="p-6 space-y-6">

          {/* LIST NAME */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              {t.listName}
            </label>
            <input
              className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Shopping for weekend…"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* SHARED USERS */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              {t.shareUser}
            </label>
            <div className="flex gap-2">
              <input
                className="flex-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={addSharedUser}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700 transition"
              >
                +
              </button>
            </div>

            {shared.length > 0 && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {t.sharedWith}: {shared.join(", ")}
              </p>
            )}
          </div>

          {/* ITEMS */}
          <div className="space-y-3">
            <label className="block text-gray-700 dark:text-gray-300 font-medium">
              {t.items}
            </label>

            {items.map((item) =>
              item.isOpen ? (
                <div
                  key={item.id}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded-2xl shadow-inner space-y-3 animate-slideUp"
                >
                  {/* NAME */}
                  <div>
                    <label className="text-sm font-medium dark:text-gray-200">
                      {t.name}
                    </label>
                    <input
                      className="w-full p-3 rounded-xl bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, { name: e.target.value })
                      }
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="text-sm font-medium dark:text-gray-200">
                      {t.description}
                    </label>
                    <textarea
                      className="w-full p-3 rounded-xl bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, { description: e.target.value })
                      }
                    />
                  </div>

                  {/* QUANTITY */}
                  <div>
                    <label className="text-sm font-medium dark:text-gray-200">
                      {t.quantity}
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        className="px-3 py-1 bg-gray-300 dark:bg-gray-500 rounded-lg"
                        onClick={() =>
                          updateItem(item.id, {
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                      >
                        -
                      </button>
                      <span className="text-gray-900 dark:text-gray-100">
                        {item.quantity}
                      </span>
                      <button
                        className="px-3 py-1 bg-gray-300 dark:bg-gray-500 rounded-lg"
                        onClick={() =>
                          updateItem(item.id, { quantity: item.quantity + 1 })
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => cancelItem(item.id)}
                      className="px-4 py-2 rounded-xl bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={() => saveItem(item.id)}
                      className="px-4 py-2 rounded-xl bg-green-600 text-white shadow hover:bg-green-700 transition"
                    >
                      {t.saveItem}
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={item.id}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl shadow flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium dark:text-white">
                      {item.name || t.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      {item.quantity} ks
                    </p>
                  </div>

                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg shadow"
                    onClick={() => updateItem(item.id, { isOpen: true })}
                  >
                    Detail
                  </button>
                </div>
              )
            )}

            {/* ADD NEW ITEM */}
            <div className="flex justify-center pt-2">
              <button
                onClick={addItem}
                className="w-12 h-12 rounded-full bg-blue-600 text-white text-3xl shadow-md hover:scale-110 active:scale-95 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* SAVE LIST BUTTON */}
          <button
            onClick={saveList}
            className="w-full py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition text-lg font-semibold"
          >
            {t.saveList}
          </button>

          {/* CANCEL */}
          <button
            onClick={onClose}
            className="w-full py-2 text-center text-gray-700 dark:text-gray-200 hover:underline"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
