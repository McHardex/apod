import React from 'react';
import Portal from 'components/Portal';
import { render } from '@testing-library/react';

const props = {
  id: 'prev',
  children: <div>bukunmi</div>
};

describe('Portal', () => {
  test('render Portal without crashing', () => {
    const { container } = render(<Portal {...props} />);
    expect(container).toBeInTheDocument();
  });
});
