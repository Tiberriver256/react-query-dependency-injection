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
interface UsersServiceImplementation {
  getById(id: number): Promise<User>;
  listUsers(page?: number): Promise<ListUsersResponse>;
}
```

Then let's create a context bound to this interface and a hook for consuming
that interface:

```ts
export const UsersServiceContext = createContext<UsersServiceImplementation | null>(null);
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
class UsersApiService implements UsersServiceImplementation {
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

Then we'll write a second in memory implementation that simulates speaking with
an API:

```ts
export const FakeUserData: User[] = [
  {
    id: 1,
    email: 'george.bluth@reqres.in',
    first_name: 'George',
    last_name: 'Bluth',
    avatar: 'https://reqres.in/img/faces/1-image.jpg',
  },
  {
    id: 2,
    email: 'janet.weaver@reqres.in',
    first_name: 'Janet',
    last_name: 'Weaver',
    avatar: 'https://reqres.in/img/faces/2-image.jpg',
  },
  {
    id: 3,
    email: 'emma.wong@reqres.in',
    first_name: 'Emma',
    last_name: 'Wong',
    avatar: 'https://reqres.in/img/faces/3-image.jpg',
  },
  {
    id: 4,
    email: 'eve.holt@reqres.in',
    first_name: 'Eve',
    last_name: 'Holt',
    avatar: 'https://reqres.in/img/faces/4-image.jpg',
  },
  {
    id: 5,
    email: 'charles.morris@reqres.in',
    first_name: 'Charles',
    last_name: 'Morris',
    avatar: 'https://reqres.in/img/faces/5-image.jpg',
  },
  {
    id: 6,
    email: 'tracey.ramos@reqres.in',
    first_name: 'Tracey',
    last_name: 'Ramos',
    avatar: 'https://reqres.in/img/faces/6-image.jpg',
  },
];

export class UsersInMemoryService implements UsersServiceImplementation {
  getById(id: number): Promise<User> {
    var user = FakeUserData.find((u) => u.id === id);

    if (!user) {
      throw new Error('Unable to find user');
    }
    return this.delayResponse(user);
  }

  listUsers(page?: number): Promise<ListUsersResponse> {
    return this.delayResponse({
      page: 1,
      per_page: 6,
      total: 12,
      total_pages: 2,
      data: FakeUserData,
      support: {
        url: 'https://reqres.in/#support-heading',
        text: 'To keep ReqRes free, contributions towards server costs are appreciated!',
      },
    } as ListUsersResponse);
  }

  private delayResponse<Type>(object: Type): Promise<Type> {
    return new Promise<Type>((resolve) => {
      setTimeout(() => {
        resolve(object);
      }, 100);
    });
  }
}
```

The `FakeUserData` is exported so that I can modify the fake data easily from
within a test. The `delayResponse` method is meant to simply take static data
and delay returning that data for 100ms to simulate the delay it would take to
work with an API.

I'm not implementing paging here but I could relatively easily, if I needed to
be able to test that within my application.

Now I'm ready to wire everything up. In my application I'll inject the API
implementation as follows:

```tsx
<UsersServiceContext.Provider value={new UsersApiService()}>. . . APP Code here</UsersServiceContext.Provider>
```

In my tests I can swap out that implementation for the in memory implementation
like this:

```tsx
<UsersServiceContext.Provider value={new UsersInMemoryService()}>. . . APP Code here</UsersServiceContext.Provider>
```

### Demo

Check out the demo code!
