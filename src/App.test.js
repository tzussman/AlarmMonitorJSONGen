import React from 'react';
import { render } from '@testing-library/react';
import JSONGenerator from './JSONGenerator.js';

test('renders learn react link', () => {
  const { getByText } = render(<JSONGenerator />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
