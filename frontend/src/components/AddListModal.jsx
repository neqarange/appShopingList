import { useState } from "react";
import { api } from "../api";

export default function AddListModal({ onClose, onCreated }) {
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

  const saveItem = (id) => {
    updateItem(id, { isOpen: false });
  };

  const cancelItem = (id) => {
    const it = items.find((i) => i.id === id);
    if (!it.name.trim() && !it.description.trim()) {
      setItems(items.filter((i) => i.id !== id));
    } else {
      updateItem(id, { isOpen: false });
    }
  };

  const addSharedUser = () => {
    if (!email.trim()) return;
    if (!shared.includes(email.trim())) {
      setShared([...shared, email.trim()]);
    }
    setEmail("");
  };

  const saveList = async () => {
    if (!name.trim()) {
      return alert("Zadej název seznamu.");
    }

    try {
      const list = await api.createList(name);

      for (const userEmail of shared) {
        await api.shareList(list._id, userEmail);
      }

      for (const it of items) {
        if (!it.name.trim()) continue;

        await api.addItem(
          list._id,
          it.name,
          it.description,
          it.quantity
        );
      }

      onCreated();
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex justify-center items-center p-4 z-50 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl space-y-6 transition-colors">

        <h2 className="text-2xl font-bold text-center dark:text-white">
          Přidat seznam
        </h2>

        {/* Název */}
        <div>
          <label className="font-medium dark:text-gray-200">Název seznamu</label>
          <input
            className="w-full border rounded p-2 mt-1 bg-white dark:bg-gray-700 dark:text-gray-100"
            placeholder="Např. Víkendový nákup"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Sdílení */}
        <div>
          <label className="font-medium dark:text-gray-200">Přidej uživatele</label>
          <div className="flex gap-2 mt-1">
            <input
              className="flex-1 border rounded p-2 bg-white dark:bg-gray-700 dark:text-gray-100"
              placeholder="Email uživatele"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={addSharedUser}
              className="px-4 bg-blue-600 text-white rounded"
            >
              +
            </button>
          </div>

          {shared.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Sdíleno: {shared.join(", ")}
            </p>
          )}
        </div>

        {/* Položky */}
        <div className="space-y-4">
          <label className="font-medium dark:text-gray-200">Položky</label>

          {items.map((item) =>
            item.isOpen ? (
              <div
                key={item.id}
                className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-inner space-y-3"
              >
                <div>
                  <label className="text-sm font-medium dark:text-gray-200">Název</label>
                  <input
                    className="w-full border rounded p-2 bg-white dark:bg-gray-600 dark:text-gray-100"
                    value={item.name}
                    onChange={(e) =>
                      updateItem(item.id, { name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium dark:text-gray-200">Popis</label>
                  <textarea
                    className="w-full border rounded p-2 bg-white dark:bg-gray-600 dark:text-gray-100"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, { description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium dark:text-gray-200">Množství</label>
                  <div className="flex items-center gap-3">
                    <button
                      className="px-3 py-1 bg-gray-300 dark:bg-gray-500 rounded"
                      onClick={() =>
                        updateItem(item.id, {
                          quantity: Math.max(1, item.quantity - 1),
                        })
                      }
                    >
                      -
                    </button>
                    <span className="text-gray-800 dark:text-gray-100">{item.quantity}</span>
                    <button
                      className="px-3 py-1 bg-gray-300 dark:bg-gray-500 rounded"
                      onClick={() =>
                        updateItem(item.id, { quantity: item.quantity + 1 })
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => cancelItem(item.id)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 dark:text-gray-100 rounded-lg"
                  >
                    Zrušit
                  </button>
                  <button
                    onClick={() => saveItem(item.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Uložit položku
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={item.id}
                className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-medium dark:text-white">{item.name || "Položka"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    {item.quantity} ks
                  </p>
                </div>

                <button
                  className="px-3 py-1 bg-cyan-500 text-white rounded"
                  onClick={() => updateItem(item.id, { isOpen: true })}
                >
                  Detail
                </button>
              </div>
            )
          )}

          <div className="flex justify-center">
            <button
              onClick={addItem}
              className="w-10 h-10 bg-black dark:bg-gray-600 text-white rounded-full text-xl flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={saveList}
          className="w-full py-2 bg-green-600 text-white rounded-xl"
        >
          Uložit
        </button>

        <button onClick={onClose} className="w-full py-2 text-center dark:text-gray-200">
          Zrušit
        </button>
      </div>
    </div>
  );
}

