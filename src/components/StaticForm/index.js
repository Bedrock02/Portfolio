import React from 'react';
import { Icon, Form, Button } from 'semantic-ui-react';

const StaticForm = () => (
  <Form id="contact" className='static-form' action="https://formspree.io/jimsteve91@gmail.com" method="POST">
    <h2> <Icon name='mail' size='large' /> Want To Collaborate?</h2>
    <Form.Group>
      <Form.Input name="first name" label='First name' placeholder='First Name' width={8} />
      <Form.Input name="last name" label='Last Name' placeholder='Last Name' width={8} />
    </Form.Group>
    <Form.Input name="_replyto" label='Email' placeholder='Fulano@mipana.com' width={16} />
    <Form.TextArea name="message"/>
    <Button type='submit' value="send" style={{background: '#102E4A', color: 'white' }}>
      <Icon name='send' size='large' />
    </Button>
  </Form>
);

export default StaticForm;
