
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useLocation } from "react-router-dom";

const ThemeSwitcherButton = () => {
  const location = useLocation();
  
  // Only show the floating theme switcher on non-authenticated routes
  const showFloatingThemeSwitcher = location.pathname === "/" || 
                                   location.pathname === "/login";

  if (!showFloatingThemeSwitcher) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <ThemeSwitcher />
    </div>
  );
};

export default ThemeSwitcherButton;
