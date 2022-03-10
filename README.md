# React Query Dependency Injection

Using React Query, React Context, Custom Hooks, and Typescript to make easy-to-use easy-to-test code for consuming an API in your React application.

## Dependency Injection

### Concept

If you're unfamiliar with the concept of dependency injection and why it is
useful I would recommend reading through [this blog by Martin Fowler on the
topic](https://martinfowler.com/articles/injection.html).

### The Goal

The goal of using dependency injection within the context of this React Query
learning repo is to be able to use the same react-query hooks in our unit tests
and our production app. We'll use dependency injection to inject a class that
talks to our API in productio and inject a class that just uses in-memory data
during unit testing.

### React Context

> **NOTE** - Please don't use `useContext` directly in your function. Follow
> this [excellent
> guide](https://kentcdodds.com/blog/how-to-use-react-context-effectively) from
> Kent C. Dodds and wrap that into a custom hook.

React Context is mainly pitched as a method for storing application state and
sharing that application state between components. However, we can also use
React Context to store and share functions or classes. This makes it an
excellent dependency injection mechanism.

For example, let's build a Context that shares a function that returns a string:

```ts
export var MyServiceContext = React.createContext<(() => string) | null>(null);
```

We can then inject the logic for that function in using the context provider:

```jsx
<MyServiceContext.Provider value={() => 'Hello My Page!'}>
  <MyPage />
</MyServiceContext.Provider>
```

Now within that page we can use that context as:

```jsx
export function MyPage() {
  const myService = useContext(MyServiceContext);
  return (
    <div>
      <h2>My Page</h2>
      <p>Dependency injection magic: {myService && myService()}</p>
    </div>
  );
}
```

What you'll see printed on the page is the text 'Hello My Page!'.

That is the basics of dependency injection. Now I can swap out the
implementation of this function without ever having to update or change code in
the MyPage component.

This means in my production App I might do something like this:

```jsx
<MyServiceContext.Provider value={getDataFromAPI}>
  <MyPage />
</MyServiceContext.Provider>
```

and in my jest tests I might wrap the component in something like this:

```jsx
<MyServiceContext.Provider value={getFakeData}>
  <MyPage />
</MyServiceContext.Provider>
```

Now, that was a simple function, in production we'd probably use TypeScript
interfaces and classes instead of just a simple function. Something like this:

```ts
export interface MyDataService {
    getData(): string
}


export var MyServiceContext = React.createContext<MyDataService | null>(null);
```

and then write two implementations of the MyDataService like this:

```ts
export class MyAPIDataService implements MyDataService {
    getData(): string {
        // Talk to API here
    }
}

export class MyInMemoryDataService implements MyDataService {
    getData(): string {
        // Return fake data
    }
}
```

### Demo Code

Check out the demo code. We've got two different implementations of the same
interface injected into two different pages. See the text on Page 1 and Page 2
is different.
