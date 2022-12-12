import React from 'react';
import { Button, Icon } from 'semantic-ui-react'

export const AnimatedButton = ({title, iconName, onClick, ...otherProps}) => {
  return (
    <div>
      <Button {...otherProps} onClick={onClick} animated>
        <Button.Content visible>{title}</Button.Content>
        <Button.Content hidden>
          <Icon name={iconName} />
        </Button.Content>
      </Button>
    </div>
  )
}