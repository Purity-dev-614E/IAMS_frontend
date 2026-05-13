import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  // Splash/Landing page transition - elegant fade and slide
  splash: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  },
  
  // Login page transition - slide from right
  login: {
    initial: { opacity: 0, x: 100 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    exit: { 
      opacity: 0, 
      x: -100,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  },
  
  // Register page transition - slide from left
  register: {
    initial: { opacity: 0, x: -100 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    exit: { 
      opacity: 0, 
      x: 100,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  },
  
  // Standard transition for other pages - fade and scale
  standard: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }
};

const getTransitionType = (pathname) => {
  if (pathname === '/') return 'splash';
  if (pathname === '/login') return 'login';
  if (pathname === '/register') return 'register';
  return 'standard';
};

const PageTransition = ({ children }) => {
  const location = useLocation();
  const transitionType = getTransitionType(location.pathname);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants[transitionType]}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
