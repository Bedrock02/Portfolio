import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import { icon } from "./header.module.css";

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
      <Menu style={{"background": "#353535"}} pointing secondary>
        <Menu.Item
          name='home'
          active={activeItem === 'home'}
          onClick={this.handleItemClick}
          link={true}
          href="#home"
          >
            <Icon disabled name='code' className={icon} />
        </ Menu.Item>
        <Menu.Item href="#about" link={true} name='about' active={activeItem === 'about'} onClick={this.handleItemClick} />
        <Menu.Item href="#work" link={true} name='work' active={activeItem === 'work'} onClick={this.handleItemClick} />
      </Menu>
    );
  }
};
export default Header
