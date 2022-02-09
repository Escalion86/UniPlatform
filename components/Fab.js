import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { motion } from 'framer-motion'

const pulse = {
  pulse: {
    initial: { scale: 1, opacity: 1 },
    scale: [1, 1.4],
    opacity: [1, 0],
    // duration: 1,
    // ease: ['backIn', 'easeOut', 'easeOut', 'easeOut'],
    transition: {
      // delay: 5,
      duration: 1.5,
      repeat: Infinity,
      repeatDelay: 0.5,
      times: [0, 1],
    },
  },
}

export default function Fab() {
  const color = 'rgb(87,209,99)'
  return (
    <a
      target="_blank"
      rel="nofollow"
      href="https://wa.me/79676005720"
      className="fixed z-50 flex items-center justify-center p-3 text-white rounded-full w-14 h-14 right-16 bottom-16"
      style={{ backgroundColor: color }}
    >
      {/* <motion.div className="absolute w-full h-full bg-green-500 rounded-full animate-ping"></motion.div> */}
      <motion.div
        variants={pulse}
        initial={{ scale: 1, opacity: 1 }}
        animate="pulse"
        className="absolute w-full h-full rounded-full"
        style={{ backgroundColor: color }}
      />

      <FontAwesomeIcon className="z-10" icon={faWhatsapp} />
    </a>
  )
}
