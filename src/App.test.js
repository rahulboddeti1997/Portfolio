import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './redux/store';
import App from './App';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

const AppWithProviders = ({ children }) => (
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);

test('renders fashion portfolio app', () => {
  render(<AppWithProviders />);
  // Check if the app renders without crashing
  expect(document.body).toBeInTheDocument();
});

test('renders navigation elements', () => {
  render(<AppWithProviders />);
  // Check for navigation elements that should always be present
  const searchBox = screen.getByRole('combobox');
  expect(searchBox).toBeInTheDocument();
});
