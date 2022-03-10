# React Query Dependency Injection

Using React Query, React Context, Custom Hooks, and Typescript to make easy-to-use easy-to-test code for consuming an API in your React application.

## React Query Dependency Injection

### Concept

Building on the learnings of our two previous concepts, let's combine the two to
make a React Query service that uses dependency injection.

### Goal

Use dependency injection to allow our React Query service to use multiple
implementations of the same service.

### How it works

Let's first start by defining an interface for our API:

```ts
interface UsersService {
  getById(id: number): Promise<User>;
  listUsers(page?: number): Promise<ListUsersResponse>;
}
```

Then let's create a context bound to this interface and a hook for consuming
that interface:

```ts
export const UsersServiceContext = createContext<UsersService | null>(null);
UsersServiceContext.displayName = 'UsersServiceContext';

const ERROR_TEXT = 'UsersService must be used within an UsersServiceContext.Provider component';

const useUsersContext = () => {
  const context = useContext(UsersServiceContext);
  if (context == null) {
    throw new Error(ERROR_TEXT);
  }
  return context;
};
```

Now let's plug that service into our react query code:

```ts
export const UsersService = {
  useGetUserByIdQuery(
    id: number,
    queryOptions: Omit<UseQueryOptions<User, Error, User, QueryKey>, 'queryKey' | 'queryFn'> = {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  ): UseQueryResult<User, Error> {
    var userServiceImplementation = useUsersContext();
    return useQuery<User, Error>(['UsersService.getById', id], () => userServiceImplementation.getById(id), queryOptions);
  },
  useListUsersQuery(
    page: number = 1,
    queryOptions: Omit<UseQueryOptions<ListUsersResponse, Error, ListUsersResponse, QueryKey>, 'queryKey' | 'queryFn'> = {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  ): UseQueryResult<ListUsersResponse, Error> {
    var userServiceImplementation = useUsersContext();
    return useQuery<ListUsersResponse, Error>(['UsersService.listUsers', page], () => userServiceImplementation.listUsers(page), queryOptions);
  },
};
```

At this point we've successfully decoupled our react-query code from being tied
to any one implementation. Now we can move the code we wrote in module 2 for
talking to the API into a new file and declare the class as implementing the
interface as follows:

```ts
class UsersApiService implements UsersService {
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
      urlSearchParams.append('page', page.toString());
    }
    var response = await fetch(`https://reqres.in/api/users?${urlSearchParams.toString()}`);

    const responseContent = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to update user profile. ${responseContent}`);
    }

    return responseContent as ListUsersResponse;
  }
}
```
