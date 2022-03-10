# React Query Dependency Injection

Using React Query, React Context, Custom Hooks, and Typescript to make easy-to-use easy-to-test code for consuming an API in your React application.

## React Query Custom Hooks

### Concept

When using React Query for communication with an API you will want to figure out
a good way to avoid using the `useQuery` and other React Query hooks directly
within your components. Abstracting them out further to a central collection of
hooks will help to keep defaults consistent across your application and make it
feel a little more like you're using a regular service class.

### Goal

The goal is to be able to write something like this in your component code:

```jsx
const usersQuery = UsersService.useGetUserByEmailQuery(email);
```

optionally being able to pass your typical React Query options as the second parameter like:

```jsx
const usersQuery = UsersService.useGetUserByEmailQuery(email, { enabled: false });
```

The `UsersService` here is a single import that houses all the React Query hooks
required for talking to the Users API.

### How it works

We have a simple class for interacting with the [https://reqres.in/]
users API that we want to use React Query for:

<details>
   <summary>Service Implementation</summary>

```ts
export class UsersApiService {
  async getById(id: number): Promise<User> {
    var response = await fetch(`https://reqres.in/api/users/${id}`);

    const responseContent = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to update user profile. ${responseContent}`);
    }

    return responseContent as User;
  }

  async listUsers(page?: number): Promise<ListUsersResponse> {
    const urlSearchParams = new URLSearchParams();
    if (page) {
      urlSearchParams.append('page', page);
    }
    var response = await fetch(`https://reqres.in/api/users?${urlSearchParams.toString()}`);

    const responseContent = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to update user profile. ${responseContent}`);
    }

    return responseContent as ListUsersResponse;
  }
}

export interface ListUsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support: Support;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface Support {
  url: string;
  text: string;
}
```

</details>

Let's start by creating a new file called `UsersService.ts` and let's add the
following code:

```ts
export const UsersService = {};
```

This will be our single export from this file. Now let's create a couple of
custom hooks we will use to to wrap React Query with:

```ts
export const UsersService = {
  useGetUserByIdQuery(id: number) {},
  useListUsersQuery(page: number = 1) {},
};
```

Naming convention here is to follow the same naming convention that React Query
uses with it's hooks except injecting our own service name into the middle. For
example, I'm wrapping a method called `getUserById` which is going to use a
`useQuery` React Query hook, I am going to wind up with `useGetUserByIdQuery`.

Next, I'm going to add the TypeScript return types to these functions. Different
React Query hooks have different return types but both of these are going to use
the `useQuery` hook so we can write them as follows:

```ts
export const UsersService = {
  useGetUserByIdQuery(id: number): UseQueryResult<User, Error> {},
  useListUsersQuery(page: number = 1): UseQueryResult<ListUsersResponse, Error> {},
};
```

There are two generics for a `UseQueryResult` class. The first type (`User` in
our first function) specifies what type of an object we will return when the
query is successful. The second type (`Error` in our first function) specifies
what type of an object we will return when the query errors out.

Now we can actually start plugging in the logic:

```ts
const usersApiService = new UsersApiService();

export const UsersService = {
  useGetUserByIdQuery(id: number): UseQueryResult<User, Error> {
    return useQuery<User, Error>(['UsersService.getById', id], () => usersApiService.getById(id));
  },
  useListUsersQuery(page: number = 1): UseQueryResult<ListUsersResponse, Error> {
    return useQuery<ListUsersResponse, Error>(['UsersService.listUsers', page], () => usersApiService.listUsers(page));
  },
};
```

We've plugged in useQuery, we've centrally defined query keys and hidden the
management of those query keys from the end user. We still have a problem
though. What if the consumer needs to tweak some of the options that are usually
passed to useQuery? Let's expose those options out:

```ts
const usersApiService = new UsersApiService();

export const UsersService = {
  useGetUserByIdQuery(id: number, queryOptions?: Omit<UseQueryOptions<User, Error, User, QueryKey>, 'queryKey' | 'queryFn'>): UseQueryResult<User, Error> {
    return useQuery<User, Error>(['UsersService.getById', id], () => usersApiService.getById(id), queryOptions);
  },
  useListUsersQuery(
    page: number = 1,
    queryOptions?: Omit<UseQueryOptions<ListUsersResponse, Error, User, ListUsersResponse>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<ListUsersResponse, Error> {
    return useQuery<ListUsersResponse, Error>(['UsersService.listUsers', page], () => usersApiService.listUsers(page), queryOptions);
  },
};
```

At this stage we can add some default query options if we like:

```ts
const usersApiService = new UsersApiService();

export const UsersService = {
  useGetUserByIdQuery(
    id: number,
    queryOptions: Omit<UseQueryOptions<User, Error, User, QueryKey>, 'queryKey' | 'queryFn'> = {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  ): UseQueryResult<User, Error> {
    return useQuery<User, Error>(['UsersService.getById', id], () => usersApiService.getById(id), queryOptions);
  },
  useListUsersQuery(
    page: number = 1,
    queryOptions: Omit<UseQueryOptions<LListUsersResponse, Error, ListUsersResponse, QueryKey>, 'queryKey' | 'queryFn'> = {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  ): UseQueryResult<ListUsersResponse, Error> {
    return useQuery<ListUsersResponse, Error>(['UsersService.listUsers', page], () => usersApiService.listUsers(page), queryOptions);
  },
};
```

And now we're fully ready to use the service within a component as:

```tsx
import { UsersService } from './services/users-service.ts';
const usersQuery = UsersService.useGetUserByIdQuery(1);
```

Check out the demo app to see how everything works together.

### One last problem

How do we test this? Right now the API class is in the same file. Let's look at
our next module for how to use the dependency injection we learned in the first
module to make this easier to test.
