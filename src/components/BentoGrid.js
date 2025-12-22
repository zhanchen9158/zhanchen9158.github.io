import { motion } from 'framer-motion';

// 1. Container Variants (The Grid)
const containerVars = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5, // Delay between each card
    },
  },
};

// 2. Card Variants
const cardVars = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.1 // Delay between items inside the card
    }
  },
};

// 3. Item Variants (Inside the card)
const itemVars = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export const BentoGrid = () => {
  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      whileInView="visible" // Triggers when user scrolls to the grid
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {[1, 2, 3].map((i) => (
        <motion.div key={i} variants={cardVars} className="p-6 bg-slate-900 rounded-2xl">
          {/* Internal Content Staggered */}
          <motion.div variants={itemVars} className="w-12 h-12 bg-indigo-500 rounded-lg mb-4" />
          <motion.h3 variants={itemVars} className="text-white font-bold">Project {i}</motion.h3>
          <motion.p variants={itemVars} className="text-slate-400 text-sm">Description of work.</motion.p>
        </motion.div>
      ))}
    </motion.div>
  );
};