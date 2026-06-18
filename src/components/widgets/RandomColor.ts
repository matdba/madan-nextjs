export default function getColorClassById(id: number) {
  const colors = [
    "bg-orange-100 text-orange-600",
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-red-100 text-red-600",
  ];

  return colors[id % colors.length];
}
