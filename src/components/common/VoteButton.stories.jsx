import React from 'react';
import VoteButton from './VoteButton';

export default {
  title: 'Components/VoteButton',
  component: VoteButton,
  argTypes: {
    type: { control: { type: 'select' }, options: ['up', 'down'] },
    count: { control: 'number' },
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
};

function Template(args) {
  return <VoteButton {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  type: 'up',
  count: 5,
  active: false,
  disabled: false,
};

export const UpvoteActive = Template.bind({});
UpvoteActive.args = {
  type: 'up',
  count: 12,
  active: true,
  disabled: false,
};

export const DownvoteActive = Template.bind({});
DownvoteActive.args = {
  type: 'down',
  count: 3,
  active: true,
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  type: 'up',
  count: 7,
  active: false,
  disabled: true,
};
