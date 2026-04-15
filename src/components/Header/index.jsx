import React, { useState, useEffect } from 'react';

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#work' },
  { name: 'AI Chat', href: '#chat' },
];

export default function Header() {
  const [activeItem, setActiveItem] = useState('About');

  useEffect(() => {
    const sectionIds = ['about', 'skills', 'work', 'chat'];
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
    <nav className="sidebar-nav" aria-label="Primary">
      {navItems.map(({ name, href }) => {
        const isActive = activeItem === name;
        return (
          <a
            key={name}
            href={href}
            className={`sidebar-nav-item${isActive ? ' active' : ''}`}
            onClick={() => setActiveItem(name)}
            aria-current={isActive ? 'true' : undefined}
          >
            <span className="sidebar-nav-line" aria-hidden="true" />
            <span className="sidebar-nav-text">{name}</span>
          </a>
        );
      })}
    </nav>
  );
}
