"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AuthButton } from "./authButton";
import { NavLinks } from "./navLinks";
import CubingKeralaFooter from "../footer";

interface MobileMenuProps {
  isOpen: boolean;
  userId?: number;
  isLoggedIn: boolean;
  onLogout: () => void;
  onClose: () => void;
}

const menuVariants = {
  closed: {
    opacity: 0,
    y: "-100%",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      when: "afterChildren",
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  closed: { opacity: 0, y: 20 },
  open: { opacity: 1, y: 0 },
};

export function MobileMenu({
  isOpen,
  userId,
  isLoggedIn,
  onLogout,
  onClose,
}: MobileMenuProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.nav
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          aria-label="Mobile menu"
          className="fixed inset-0 z-40 bg-neutral-950 flex flex-col pt-[58px] md:hidden"
        >
          <div className="flex-1 flex flex-col space-y-6 px-6 pt-4">
            <motion.div variants={itemVariants} className="flex flex-col space-y-4">
              <NavLinks
                userId={userId}
                onClose={onClose}
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="pt-4 border-t border-stone-800">
              <AuthButton
                isLoggedIn={isLoggedIn}
                onLogout={onLogout}
                onClose={onClose}
              />
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-auto">
            <CubingKeralaFooter />
          </motion.div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
