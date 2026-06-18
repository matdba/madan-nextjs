import Image from "next/image";

export default function BubblyRhombus() {
  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-50">
      {/* Faded tilted rhombus behind */}
      <div
        className="absolute w-96 h-96 opacity-20"
        style={{
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          borderRadius: "3rem",
          transform: "rotate(10deg)",
          backgroundColor: "#93C5FD", // light blue
        }}
      ></div>

      {/* Main rhombus image container */}
      <div
        className="relative w-64 h-64 overflow-hidden"
        style={{
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          borderRadius: "3rem",
        }}
      >
        <Image
          src="/public"
          alt="Rhombus"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
