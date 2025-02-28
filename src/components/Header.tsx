
import { Bell, User, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };
  
  // Initialize theme from localStorage or user preference
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  return (
    <header className="h-16 fixed top-0 right-0 left-64 z-10 glass shadow-sm animate-fade-in backdrop-blur-md">
      <div className="flex items-center justify-between h-full px-6">
        <div>
          <h2 className="text-lg font-medium">Welcome to GeoAccess Manager</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-2 border-l pl-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <User size={16} />
            </div>
            <div className="text-sm">
              <p className="font-medium">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
