import React, { useState } from "react";
import InkopskorgWidget from "../components/InkopskorgWidget";
import ChatWidget from "../components/ChatWidget";
import FuelTopList from "../components/FuelTopList";
import TodoWidget from "../components/TodoWidget";

export default function HomePage() {
  const [shoppingList, setShoppingList] = useState([]);

  const addToList = (item) => {
    setShoppingList((prev) => [...prev, item]);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto font-jakarta">
      {/* Widget grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Widget 3 – Todo */}
        <TodoWidget />
        
        {/* Widget 1 – Inköpslista */}
        <InkopskorgWidget list={shoppingList} />

        {/* Widget 2 – Bensin */}
        <FuelTopList />

        {/* Widget 4 – AI-bot */}
        <ChatWidget />
      </div>
    </div>
  );
}
