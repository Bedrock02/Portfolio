import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

function AnimatedButton({
  title, iconName, onClick,
}) {
  return (
    <div style={{ padding: '50px 0px' }}>
      <Button primary onClick={onClick} animated>
        <Button.Content visible>{title}</Button.Content>
        <Button.Content hidden>
          <Icon name={iconName} />
        </Button.Content>
      </Button>
    </div>
  );
}

AnimatedButton.propTypes = {
  title: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default AnimatedButton;
