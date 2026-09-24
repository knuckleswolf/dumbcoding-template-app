import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { expect, it } from 'vitest';

function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount((current) => current + 1)}>Count: {count}</button>;
}

it('renders and updates React in the jsdom test environment', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  const button = screen.getByRole('button', { name: 'Count: 0' });
  await user.click(button);

  expect(screen.getByRole('button', { name: 'Count: 1' })).toBe(button);
});
