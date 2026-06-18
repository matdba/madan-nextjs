import {
  SettingsMinimalistic,
  SmartVacuumCleaner,
  Waterdrop,
  Waterdrops,
} from "@solar-icons/react"; // ← example icons
import { JSX } from "react/jsx-runtime";

export function getServiceIcon(type: string) {
  const map: Record<
    string,
    JSX.Element
  > = {
    vacum: <div className="bg-green-100 text-green-400 rounded-xl p-1.5"><SmartVacuumCleaner size={16} /></div>,
    washing: <div className="bg-blue-100 text-blue-600 rounded-xl p-1.5"><Waterdrops size={16} /></div>,
    engine_washing: <div className="bg-red-100 text-red-400 rounded-xl p-1.5"><SettingsMinimalistic size={16} /></div>,
    total_washing: <div className="bg-orange-100 text-orange-400 rounded-xl p-1.5"><Waterdrop size={16} /></div>,
  };

  return map[type];
}
