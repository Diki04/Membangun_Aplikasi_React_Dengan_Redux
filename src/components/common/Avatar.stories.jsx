import React from 'react';
import Avatar from './Avatar';

export default {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    size: { control: { type: 'select' }, options: ['xs', 'sm', 'md', 'lg'] },
    name: { control: 'text' },
    src: { control: 'text' },
  },
};

function Template(args) {
  return <Avatar {...args} />;
}

export const WithImage = Template.bind({});
WithImage.args = {
  src: 'https://ui-avatars.com/api/?name=John+Doe&background=7c3aed&color=fff',
  name: 'John Doe',
  size: 'md',
};

export const WithInitials = Template.bind({});
WithInitials.args = {
  src: '',
  name: 'Jane Smith',
  size: 'md',
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  src: 'https://ui-avatars.com/api/?name=A&background=2563eb&color=fff',
  name: 'Alice',
  size: 'sm',
};

export const ExtraSmallSize = Template.bind({});
ExtraSmallSize.args = {
  src: '',
  name: 'Bob',
  size: 'xs',
};
