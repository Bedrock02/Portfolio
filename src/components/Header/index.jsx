import React, { useState, useEffect } from 'react';

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#work' },
  { name: 'Life', href: '#life' },
];

export default function Header() {
  const [activeItem, setActiveItem] = useState('About');

  useEffect(() => {
    const sectionIds = ['about', 'work', 'life'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const matched = navItems.find((item) => item.href === `#${entry.target.id}`);
            if (matched) setActiveItem(matched.name);
          }
        });
      },
      { threshold: 0.3 },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sidebar-nav">
      {navItems.map(({ name, href }) => (
        <a
          key={name}
          href={href}
          className={`sidebar-nav-item${activeItem === name ? ' active' : ''}`}
          onClick={() => setActiveItem(name)}
        >
          <span className="sidebar-nav-line" />
          <span className="sidebar-nav-text">{name}</span>
        </a>
      ))}
    </nav>
  );
}
