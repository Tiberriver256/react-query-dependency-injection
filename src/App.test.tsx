import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { UsersInMemoryService } from './services/implementations/users-in-memory-service';
import { UsersServiceContext } from './services/users-service';
import { QueryClient, QueryClientProvider } from 'react-query';

const usersInMemoryService = new UsersInMemoryService();
const queryClient = new QueryClient();
test('renders learn react link', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <UsersServiceContext.Provider value={usersInMemoryService}>
        <App />
      </UsersServiceContext.Provider>
    </QueryClientProvider>
  );
  const linkElement = await screen.findByText(/janet\.weaver@reqres\.in/i);
  expect(linkElement).toBeInTheDocument();
});
