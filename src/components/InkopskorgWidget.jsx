import React from "react";

export default function InkopskorgWidget({ list }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 text-left">
      <h2 className="font-semibold text-lg mb-2">📝 Inköpslista</h2>
      {list.length === 0 ? (
        <p className="text-sm text-gray-500">Inga produkter ännu.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <img src={item.logo} alt="butik" className="w-6 h-6" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500">{item.amount}</p>
              </div>
              <span className="text-sm font-bold">{item.priceText}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
