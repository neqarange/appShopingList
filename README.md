# Shopping List App

Jednoduchá webová aplikace pro správu nákupních seznamů.  
Projekt je postavený na **Reactu** (frontend) a **Node.js + Express** (backend).  
Stylování je řešeno pomocí **Tailwind CSS**.

---

## Funkce

- Zobrazení všech nákupních seznamů (Dashboard)
- Možnost přidávat nové položky
- Úprava a mazání existujících položek
- Detailní zobrazení jednotlivého seznamu
- Ukládání dat (např. pomocí mock dat nebo API endpointů)
- Stylování pomocí Tailwindu

---

## Struktura projektu

```
shopingList/
├── frontend/               # React aplikace
│   ├── src/
│   │   ├── components/
│   │   │   └── Dashboard/
│   │   │       ├── Detail/
│   │   │       │   ├── ActionButtons.jsx
│   │   │       │   ├── DeleteItem.jsx
│   │   │       │   ├── ItemForm.jsx
│   │   │       │   ├── QuantitySelector.jsx
│   │   │       │   └── SaveNewItem.jsx
│   │   │       ├── ListCard.jsx
│   │   │       ├── ListItem.jsx
│   │   │       └── MemberTag.jsx
│   │   ├── data/
│   │   │   └── shoppingLists.js
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   └── DetailPage.jsx
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                # Node.js + Express server (v budoucnu)
│   └── index.js
│
└── README.md
```

---

## Instalace a spuštění

### 1️⃣ Klonování repozitáře
```bash
git clone https://github.com/uzivatel/shopingList.git
cd shopingList
```

### 2️⃣ Instalace závislostí pro frontend
```bash
cd frontend
npm install
```

### 3️⃣ Spuštění vývojového serveru
```bash
npm start
```

Frontend poběží na adrese:  
👉 [http://localhost:3000](http://localhost:3000)

---

## Použité technologie

- [React](https://reactjs.org/)
- [React Router DOM](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)

---

## Autor

**Petr Nekvinda**  
📅 2025  
💬 Školní projekt – _IT Programming_

---

## 🪄 Poznámky

- V adresáři `data/` jsou prozatím uložené statické datové soubory.
- Backend (`index.js`) lze později rozšířit o REST API pro ukládání a čtení dat.
- Take to musim spojit s databazi
- Tailwind je nakonfigurován přes `postcss.config.js` a `tailwind.config.js`.

---
