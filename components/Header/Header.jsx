"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // Use next/navigation for client components

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import ToggleSwitch from "@/components/Header/ToggleSwitch";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const userPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(userPrefersDark);
    document.documentElement.classList.toggle("dark", userPrefersDark);
  }, []);

  const handleToggle = (isDarkMode) => {
    setDarkMode(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const pathname = usePathname();

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const getActiveClass = (path) => {
    return pathname === path ? "text-gray-400 dark:text-gray-400 underline" : "";
  };

  return (
    <>
      {/* Desktop Header */}
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="hidden lg:flex bg-gray-50 fixed w-full top-0 z-50 sm:px-16 md:px-48 lg:px-56 py-4"
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-800">
            CrossNoughts
          </Link>
          <nav className="space-x-8 flex items-center">
            <Link href="/" className={`hover:underline ${getActiveClass("/")}`}>
              Home
            </Link>
            <Link href="/leaderboard" className={`hover:underline ${getActiveClass("/about")}`}>
              LeaderBoard
            </Link>
            <Link href="/HighScore" className={`hover:underline ${getActiveClass("/portfolio")}`}>
              HighScore
            </Link>
            {/* <ToggleSwitch checked={darkMode} onChange={handleToggle} /> */}
            <Link href="/Profile">
              <button
                className={`bg-gray-600 text-gray-50 py-1 px-8 rounded-lg hover:bg-gray-500 font-semibold ${getActiveClass(
                  "/profile"
                )}`}
              >
                Profile
              </button>
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Header */}
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="lg:hidden bg-[var(--bg-color)] text-[var(--text-color)] shadow-md fixed w-full top-0 z-60 flex justify-between items-center py-1 px-5"
      >
        <Link href="/" className="text-xl font-bold">
          CrossNoughts
        </Link>
        <section className="flex">
          {/* <div className="mt-4 px-4">
            <ToggleSwitch checked={darkMode} onChange={handleToggle} />
          </div> */}
          <button
            onClick={toggleSidebar}
            className="text-3xl py-2 text-gray-700"
            aria-label="Menu"
          >
            ☰
          </button>
        </section>
      </motion.header>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: sidebarOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed top-0 right-0 w-64 h-full bg-gray-50 text-gray-800 shadow-lg z-40 lg:hidden"
      >
        <div className="flex justify-start items-center p-4">
          <button
            onClick={toggleSidebar}
            className="text-2xl"
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>
        <nav className="mt-4 px-4 flex flex-col text-center">
          <Link
            href="/"
            onClick={closeSidebar}
            className={`block py-2 hover:underline ${getActiveClass("/")}`}
          >
            Home
          </Link>
          <Link
            href="/leaderboard"
            onClick={closeSidebar}
            className={`block py-2 hover:underline ${getActiveClass("/leaderboard")}`}
          >
            LeaderBoard
          </Link>
          <Link
            href="/highscore"
            onClick={closeSidebar}
            className={`block py-2 hover:underline ${getActiveClass("/highscore")}`}
          >
            HighScore
          </Link>
         
          <Link
            href="/profile"
            onClick={closeSidebar}
            className={`mt-4 w-full bg-gray-600 text-gray-50 py-2 px-5 rounded ${getActiveClass(
              "/profile"
            )}`}
          >
            Profile
          </Link>
        </nav>
      </motion.aside>
    </>
  );
};

export default Header;
