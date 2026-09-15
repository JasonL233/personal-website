import React from "react";
import { motion } from "framer-motion";

const ProjectTag = ({ name, onClick, isSelected }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
                 relative px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out
                   ${
                     isSelected
                       ? "bg-[var(--highlight)] text-[var(--foreground)] shadow-lg shadow-[#c4a57a]/25"
                       : "bg-[var(--soft)] text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--foreground)] shadow-md hover:shadow-lg"
                   }
             `}
      onClick={() => onClick(name)}
    >
      {name}
      {isSelected && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-[var(--highlight)] rounded-full -z-10"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.button>
  );
};

export default ProjectTag;
