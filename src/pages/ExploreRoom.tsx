import { motion, AnimatePresence } from "framer-motion";
import { ReactElement, useState, useEffect } from "react";
import { Brain, Users, GraduationCap, Search } from "lucide-react";
import bgVideo from "../assets/videos/bg-small.mp4";
import RoomGraph from "../components/RoomGraph";

interface Hotspot {
  id: string;
  x: string;
  y: string;
  icon: ReactElement;
  label: string;
  info: string;
}

const hotspots: Hotspot[] = [
  {
    id: "academic",
    x: "25%",
    y: "70%",
    icon: <GraduationCap size={40} color="#59cccaff" />,
    label: "Academic Performance",
    info:
      "Studies show that excessive social media use can reduce focus and GPA among students. Maintaining digital balance helps improve productivity and academic outcomes.",
  },
  {
    id: "relationships",
    x: "88%",
    y: "40%",
    icon: <Users size={28} color="#59cccaff" />,
    label: "Relationships",
    info:
      "Social media can connect people but may also cause tension and comparison. Healthy online boundaries strengthen real-world relationships.",
  },
  {
    id: "mental-health",
    x: "45%",
    y: "72%",
    icon: <Brain size={28} color="#59cccaff" />,
    label: "Mental Health",
    info:
      "Prolonged screen time has been linked to anxiety and sleep issues. Limiting usage and mindful scrolling can support better mental well-being.",
  },
];

export default function HeroVideo() {
  const [zoomedSpot, setZoomedSpot] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  // Wait for zoom animation to complete before showing info card
  useEffect(() => {
    if (zoomedSpot) {
      const timer = setTimeout(() => setShowInfo(true), 900); // slight delay
      return () => clearTimeout(timer);
    } else {
      setShowInfo(false);
    }
  }, [zoomedSpot]);

  const selectedSpot = hotspots.find((s) => s.id === zoomedSpot);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background video */}
      <motion.video
        key={zoomedSpot}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        animate={{
          scale: zoomedSpot ? 2.2 : 1,
          opacity: zoomedSpot ? 0.9: 1,
          x:
            zoomedSpot === "academic"
              ? "48%"
              : zoomedSpot === "relationships"
              ? "-55%"
              : zoomedSpot === "mental-health"
              ? "0%"
              : "0%",
          y:
            zoomedSpot === "academic"
              ? "-25%"
              : zoomedSpot === "relationships"
              ? "-10%"
              : zoomedSpot === "mental-health"
              ? "-30%"
              : "0%",
        }}
        transition={{
          duration: 1.2,
          ease: [0.76, 0, 0.24, 1], // cinematic in/out easing
        }}
      >
        <source src={bgVideo} type="video/mp4" />
      </motion.video>

      {/* Instruction text */}
      {!zoomedSpot && (
        <div className="absolute top-5 left-5 z-20 p-4 text-left text-white drop-shadow-lg inline-block">
          <p className="text-lg font-bold text-teal-300">
            <Search size={24} className="mr-2 text-teal-300 inline" />
            Click on an icon to explore
          </p>

        </div>
      )}

      {/* Hotspot icons (fade out on zoom) */}
      <AnimatePresence>
        {!zoomedSpot &&
          hotspots.map((spot) => (
            <motion.button
              key={spot.id}
              className="absolute z-30 text-white hover:text-primary transition-transform text-center"
              style={{ top: spot.y, left: spot.x }}
              whileHover={{ scale: 1.2 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              onClick={() => setZoomedSpot(spot.id)}
            >
              <div className="flex flex-col items-center space-y-1">
                {spot.icon}
                <span className="text-sm font-semibold text-teal-300">
                  {spot.label}
                </span>
              </div>
            </motion.button>
          ))}
      </AnimatePresence>

      {/* Overlay fade (subtle background dimming) */}
      <motion.div
        className="absolute inset-0 bg-black z-10 pointer-events-none"
        animate={{ opacity: zoomedSpot ? 0.25 : 0.1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Info card (appears after zoom) */}
      <AnimatePresence>
        {zoomedSpot && showInfo && selectedSpot && (
          <motion.div
            key={selectedSpot.id}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-11/12 md:w-2/3 lg:w-1/2 z-40 bg-white/10 backdrop-blur-md border border-teal-400/40 text-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-teal-300 mb-3">
              {selectedSpot.label}
            </h3>
            <p className="text-base leading-relaxed">{selectedSpot.info}</p>
            <RoomGraph />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit zoom button */}
      <AnimatePresence>
        {zoomedSpot && (
          <motion.button
            onClick={() => setZoomedSpot(null)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="absolute top-5 right-5 z-50 btn btn-sm bg-teal-400 border-teal-400 text-black font-semibold shadow-lg"
          >
            Exit Zoom
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
