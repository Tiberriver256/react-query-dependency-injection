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

React Context is mainly pitched as a method for storing application state and
sharing that application state between components. However, we can also use
React Context to store and share functions or classes. This makes it an
excellent dependency injection mechanism.

For example, let's build a Context that shares a function that returns a string:

