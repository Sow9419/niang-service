"use client"

import { motion } from "framer-motion";
import { url } from "inspector";
import {LucideMessageCircleMore} from "lucide-react"
export default function FuelPulsingCircle() {
  return (
    <div className="absolute bottom-8 right-8 z-30">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Animated fuel indicator */}
        <div className="absolute inset-0 rounded-full bg-yellow-500/20 animate-pulse"></div>
        <div className="absolute inset-2 rounded-full bg-yellow-500/30 animate-pulse delay-300"></div>
        <div className="absolute inset-4 rounded-full bg-yellow-500/50 animate-pulse delay-700"></div>

        {/* Rotating Text Around the Circle */}
        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{ transform: "scale(1.6)" }}
        >
          <defs>
            <path id="circle" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
          </defs>
          <text className="text-sm fill-white/80">
            <textPath href="#circle" startOffset="0%">
              MAGIC•UX • Gestion Citernes • MAGIC•UX • Gestion Citernes •
            </textPath>
          </text>
        </motion.svg>

        <div className="relative w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-black text-xs font-bold">
            <LucideMessageCircleMore className="w-6 h-6 text-white" onClick={()=> window.open("https://wa.me/22394231914", "_blank")}/>
          </span>
        </div>
      </div>
    </div>
  );
}