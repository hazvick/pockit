import { Link, useLocation } from "react-router-dom"

export default function BottomNavbar() {
  const location = useLocation()

  const navItems = [
    { path: "/", label: "Hem", icon: "🏠" },
    { path: "/matpriser", label: "Matpriser", icon: "🛒" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow z-40 flex justify-around py-2">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center text-sm ${
            location.pathname === item.path ? "text-[#1F96C1] font-bold" : "text-gray-500"
          }`}
        >
          <div className="text-xl">{item.icon}</div>
          {item.label}
        </Link>
      ))}
    </div>
  )
}
