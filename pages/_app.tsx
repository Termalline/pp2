import React, { useState, useEffect } from "react";
import "@/styles/globals.css";
import Link from "next/link";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const [name, setName] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // State to track dark mode
  const [role, setRole] = useState();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const params = { token: token };
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
// @ts-ignore
    const url = `/api/users/refresh?${new URLSearchParams(params)}`;
    const fetchData = async () => {
      const data = await fetch(url, options);
      const json = await data.json();
      if (json != null) {
        setName(json.name);
        setRole(json.role)
      } else if (json == null) {
        setName(undefined);
      }
    };
    if (token != null) {
      fetchData();
    } else if (token == null) {
      setName(undefined);
    }
  }, [pageProps]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const appClassName = darkMode
    ? "min-h-screen bg-gray-900 text-white"
    : "min-h-screen bg-white text-black";

  const navClassName = darkMode
    ? "flex flex-row bg-gray-800 text-white px-4 py-2 gap-2 flex-wrap"
    : "flex flex-row bg-blue-900 text-white px-4 py-2 gap-2 flex-wrap";

  return (
    <div className={appClassName}>
      <nav className={navClassName}>
        <Link href="/">Home</Link>
        <Link href="/compiler">Compiler</Link>
        <Link href="/templates">Templates</Link>
        <Link href="/blogposts">Blog Posts</Link>
        <Link href="/dashboard">Dashboard</Link>
        <div className="flex-1" />
        <button
          onClick={toggleDarkMode}
          className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <div className="relative">
          <button onClick={toggleDropdown} className="hover:underline">
            <div>Welcome {name ? name : "Guest"}</div>
          </button>
          {isDropdownOpen && (
            <div className="absolute bg-white text-black shadow-lg mt-2 rounded">
              <Link href="/profile" className="block px-4 py-2 hover:bg-gray-200">
                Edit Profile
              </Link>
           {role == "ADMIN" &&   <Link href="/icr" className="block px-4 py-2 hover:bg-gray-200">
                ICR
              </Link>}
            </div>
          )}
        </div>
        <Link href={name ? "/logout" : "/login"}>
          {name ? "Logout" : "Login"}
        </Link>
      </nav>
      <main className="p-4">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
