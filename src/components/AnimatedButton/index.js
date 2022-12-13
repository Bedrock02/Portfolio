import React from 'react';
import { Button, Icon } from 'semantic-ui-react'

const AnimatedButton = ({title, iconName, onClick, ...otherProps}) => {
  return (
    <div style={{padding: '50px 0px'}}>
      <Button {...otherProps} onClick={onClick} animated>
        <Button.Content visible>{title}</Button.Content>
        <Button.Content hidden>
          <Icon name={iconName} />
        </Button.Content>
      </Button>
    </div>
  )
}

export default AnimatedButton;