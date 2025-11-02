import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex mt-3 flex-col p-5 items-center justify-center bg-[#ededee] text-black">
      {/* Spinning Loader */}
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />

      {/* Loading Text */}
      <motion.p
        className="mt-6 text-lg font-medium tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Loading, please wait...
      </motion.p>
    </div>
  );
}
