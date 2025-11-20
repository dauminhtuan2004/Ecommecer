import { ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

function MenuItem({ item, isActive, collapsed, toggleSubmenu, isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const handleClick = () => {
    if (item.children) {
      toggleSubmenu(item.key);
    } else {
      navigate(item.path);
    }
  };

  return (
    <li>
      <button
        onClick={handleClick}
        className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-between
          ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}
        `}
      >
        <div className="flex items-center space-x-3">
          {item.icon && <item.icon className={`w-5 h-5 ${collapsed ? 'mx-auto' : ''}`} />}
          <span className={collapsed ? 'hidden' : 'block'}>
            {item.label}
          </span>
        </div>
        {item.children && !collapsed && (
          <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        )}
      </button>
      
      {item.children && isOpen && !collapsed && (
        <ul className="ml-4 mt-2 space-y-1">
          {item.children.map((child) => (
            <li key={child.key}>
              <button
                onClick={() => {
                  navigate(child.path);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200
                  ${location.pathname.startsWith(child.path) ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                {child.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default MenuItem;