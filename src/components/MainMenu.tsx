"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Perceptron", path: "/perceptron" },
  { label: "Adaline", path: "/adaline" },
  { label: "MLP", path: "/mlp" },
  { label: "SVM", path: "/svm" },
];

const MainMenu = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Menu principal">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            pathname === item.path
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainMenu;
