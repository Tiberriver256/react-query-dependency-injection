import { createContext, useContext } from 'react';
import { UseQueryOptions, QueryKey, UseQueryResult, useQuery } from 'react-query';

export interface UsersServiceImplementation {
  getById(id: number): Promise<User>;
  listUsers(page?: number): Promise<ListUsersResponse>;
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
