import React from 'react';
import logo from './logo.svg';
import './App.css';
import { UsersService } from './services/users-service';

function App() {
  var usersListQuery = UsersService.useListUsersQuery();

  if (usersListQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (usersListQuery.isError) {
    return <div>Something bad happened...</div>;
  }

  return (
    <>
      {usersListQuery.data?.data.map((u) => (
        <h3>{u.email}</h3>
      ))}
    </>
  );
}

export default App;
