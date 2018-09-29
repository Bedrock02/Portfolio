import React from 'react';
import { Link } from 'gatsby';
import { Grid, Container, Icon, Menu } from 'semantic-ui-react';
import headerStyles from "./header.module.css";

export class Header extends React.Component {
  constructor() {
    super();
    this.state = { activeItem: 'home' };
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick( e, { name } ) {
    this.setState( {activeItem: name} );
  }

  render() {
    const { activeItem } = this.state;
    return (
      <Menu style={{"background": "#353535"}} pointing secondary fixed="top">
        <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick}>
            <a href="#home">
              <Icon disabled name='code' className={headerStyles.icon} />
            </a>
        </Menu.Item>
        <Menu.Item name='about' active={activeItem === 'about'} onClick={this.handleItemClick}>
          <a href="#about">About</a>
        </Menu.Item>
        <Menu.Item name='work' active={activeItem === 'work'} onClick={this.handleItemClick}>
          <a href="#work">Work Experience</a>
        </Menu.Item>
        <Menu.Item name='contact' active={activeItem === 'contact'} onClick={this.handleItemClick}>
          <a href="#contact">Contact</a>
        </Menu.Item>
      </Menu>
    );
  }
};
export default Header
