import React, { useState } from "react";
import axios from "axios";

export default function MatpriserPage({ addToList }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [amount, setAmount] = useState("");

  const fetchProducts = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const res = await axios.get(`/.netlify/functions/matspar?q=${encodeURIComponent(query)}`);
    setProducts(res.data);
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto font-jakarta">
      <h1 className="text-3xl font-bold text-center mb-6">Sök matpriser 🛒</h1>
      <div className="flex items-center gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border px-4 py-2 rounded-full w-full"
          placeholder="Sök t.ex. ikaffe, coca cola zero"
        />
        <button onClick={fetchProducts} className="bg-blue-600 text-white px-6 py-2 rounded-full">
          Sök
        </button>
      </div>

      {loading && <p className="text-center text-gray-600 mb-10">🔄 Söker produkter...</p>}

      <div className="grid grid-cols-2 gap-4">
        {products.map((p, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-4 shadow">
            <img src={p.image} alt={p.name} className="h-24 w-auto mx-auto object-contain mb-3" />
            <h2 className="font-semibold text-sm">{p.name}</h2>
            <p className="text-gray-500 text-xs">{p.brand} {p.weight}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-md">
                {formatPrice(p.shops?.[0]?.priceText)}
              </p>
              <button
                onClick={() => {
                  setSelectedProduct(p)
                  setSelectedShop(p.shops[0])
                }}
                className="bg-blue-500 text-white rounded-xl w-9 h-9 text-lg"
              >
                +
              </button>
            </div>
            <div className="flex justify-center gap-2 mt-2">
              {p.shops.slice(0, 3).map((s, i) => (
                <img key={i} src={s.logo} alt="butik" className="w-8" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="font-bold text-lg mb-2">Lägg till i inköpslista</h2>
            <p className="mb-2">{selectedProduct.name}</p>

            <label className="block mt-2 text-sm">Antal / vikt:</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border w-full px-3 py-1 rounded"
              placeholder={`Ex. 1 st, 500g, ${selectedProduct.weight}`}
            />

            <label className="block mt-4 text-sm">Välj butik:</label>
            <select
              className="border w-full px-3 py-2 rounded text-sm"
              value={selectedShop?.logo || ""}
              onChange={(e) => {
                const selected = selectedProduct.shops.find(s => s.logo === e.target.value)
                setSelectedShop(selected)
              }}
            >
              {selectedProduct.shops.map((shop, i) => (
                <option key={i} value={shop.logo}>
                  {shop.priceText}
                </option>
              ))}
            </select>

            <div className="mt-4 flex justify-between">
              <button onClick={() => setSelectedProduct(null)} className="text-gray-500">
                Avbryt
              </button>
              <button
                className="bg-green-600 text-white px-4 py-1 rounded"
                onClick={() => {
                  addToList({
                    name: selectedProduct.name,
                    amount,
                    priceText: selectedShop?.priceText || "?",
                    logo: selectedShop?.logo || ""
                  })
                  setSelectedProduct(null)
                  setAmount("")
                }}
              >
                Lägg till
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatPrice(text = "") {
  const match = text.match(/(.*?)(\d[\d\s,.]*)(\s*(kr|:-))?$/i);
  if (!match) return text;

  const [_, before, number, currency] = match;

  return (
    <span className="text-md">
      {before}
      <span className="font-bold">{number}</span>
      {currency && <span className=" text-[11px] font-semibold text-gray-700 ml-0.5">{currency}</span>}
    </span>
  );
}

