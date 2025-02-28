
import { Link, useLocation } from "react-router-dom";
import { 
  Globe, 
  Clock, 
  Users, 
  Settings, 
  Home,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/", icon: <Home size={20} />, label: "Dashboard" },
    { path: "/country-blocking", icon: <Globe size={20} />, label: "Country Blocking" },
    { path: "/time-restrictions", icon: <Clock size={20} />, label: "Time Restrictions" },
    { path: "/affiliate-exceptions", icon: <Users size={20} />, label: "Affiliate Exceptions" },
    { path: "/settings", icon: <Settings size={20} />, label: "Settings" }
  ];

  return (
    <div className="h-screen w-64 bg-sidebar fixed left-0 shadow-md animate-fade-in">
      <div className="p-6">
        <h1 className="text-white text-xl font-medium">GeoAccess Manager</h1>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 group",
                  isActive(item.path) 
                    ? "bg-sidebar-accent text-white" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-white"
                )}
              >
                <span className={cn(
                  "transition-transform duration-200",
                  isActive(item.path) ? "text-white" : "text-sidebar-foreground/60 group-hover:text-white/90"
                )}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                <ChevronRight 
                  size={16} 
                  className={cn(
                    "ml-auto transition-transform duration-200",
                    isActive(item.path) ? "opacity-100" : "opacity-0 group-hover:opacity-70",
                  )} 
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-8 left-0 right-0 px-6">
        <div className="p-4 rounded-lg bg-sidebar-accent/50 border border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/80">
            GeoAccess Manager v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
