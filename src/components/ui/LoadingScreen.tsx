import { motion } from 'framer-motion';
import { DunamisLogo } from './DunamisLogo';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function LoadingScreen() {
  const text = "DUNAMIS";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#FCFCF9] dark:bg-[#0D1117] z-50">
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <DunamisLogo size="xl" />
        </motion.div>

        {/* Animated Text Loader */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex gap-1"
        >
          {text.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={item}
              className="text-4xl font-bold text-[#20808D] dark:text-[#1FB8CD]"
              style={{
                display: "inline-block",
              }}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.1,
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Pulsing subtitle */}
        <motion.p
          className="text-[#5F6368] dark:text-[#8B949E] text-sm"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          Building Strength...
        </motion.p>
      </div>
    </div>
  );
}
