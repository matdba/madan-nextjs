import {
  Cloud,
  TeaCup,
  Wind,
} from "@solar-icons/react"; // ← example icons
import { JSX } from "react/jsx-runtime";

export function getShopItemIcon(type: string) {
  const map: Record<
    string,
    JSX.Element
  > = {
    tea: <div className="bg-blue-100 text-blue-600 rounded-xl p-1.5"><TeaCup size={16} /></div>,
    freshener: <div className="bg-green-100 text-green-500 rounded-xl p-1.5"><Cloud size={16} /></div>,
    coffee: <div className="bg-red-100 text-red-500 rounded-xl p-1.5"><TeaCup size={16} /></div>,
    wax: <div className="bg-orange-100 text-orange-500 rounded-xl p-1.5"><Wind size={16} /></div>,
  };

  return map[type];
}
