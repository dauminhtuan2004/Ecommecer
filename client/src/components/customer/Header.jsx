import { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';
import HeaderMain from './header/HeaderMain';
import DesktopNav from './header/DesktopNav';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <HeaderMain 
        scrolled={scrolled}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <DesktopNav 
        scrolled={scrolled}
        categories={categories}
        categoryDropdown={categoryDropdown}
        setCategoryDropdown={setCategoryDropdown}
      />

      <MobileMenu 
        searchOpen={searchOpen}
        mobileMenuOpen={mobileMenuOpen}
        categories={categories}
      />
    </header>
  );
};

export default Header;
