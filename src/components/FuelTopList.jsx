import { useEffect, useState } from "react";

export default function FuelTopList() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("/.netlify/functions/scraper");
        const data = await res.json();
        const allStations = data.stations || [];

        const sorted = allStations.sort(
          (a, b) => parseFloat(a.price.replace(",", ".")) - parseFloat(b.price.replace(",", "."))
        );

        setStations(sorted.slice(0, 3));
      } catch (err) {
        console.error("Kunde inte hämta bensinpriser:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-6 text-left min-h-[140px]">
      <h2 className="font-semibold text-lg mb-3">⛽ Billigast 95 i Malmö</h2>
      {loading ? (
        <p className="text-sm text-gray-500">🔄 Hämtar priser...</p>
      ) : (
        <ul className="space-y-2">
          {stations.map((station, i) => (
            <li
              key={i}
              className="flex justify-between items-start border-b pb-2 last:border-none"
            >
              <div>
                <p className="text-[12px] font-medium">{station.name}</p>
                <p className="text-[10px] text-gray-500">
                  {station.address}, {station.city}
                </p>
              </div>
              <span className="flex flex-col text-md font-bold text-green-600 ml-auto">
                {station.price}
                <p className="text-[10px] font-medium text-gray-400 ml-auto">{station.date}</p>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
