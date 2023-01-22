import React, { useState } from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import { icon } from './header.module.css';

export default function Header() {
  const [activeItem, setActiveItem] = useState('home');
  const handleItemClick = (e, { name }) => {
    setActiveItem({ activeItem: name });
  };

  return (
    <Menu style={{ background: '#353535' }} pointing secondary>
      <Menu.Item
        name="home"
        active={activeItem === 'home'}
        onClick={handleItemClick}
        link
        href="#home"
      >
        <Icon disabled name="code" className={icon} />
      </Menu.Item>
      <Menu.Item href="#about" link name="about" active={activeItem === 'about'} onClick={handleItemClick} />
      <Menu.Item href="#work" link name="work" active={activeItem === 'work'} onClick={handleItemClick} />
      <Menu.Item href="#life" link name="life" active={activeItem === 'life'} onClick={handleItemClick} />
      <Menu.Item href="https://blog.wepadev.com" link name="blog" target="_blank" rel="noopener noreferrer" />
    </Menu>
  );
}
