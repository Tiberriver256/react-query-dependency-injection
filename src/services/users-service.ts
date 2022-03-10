import { UseQueryOptions, QueryKey, UseQueryResult, useQuery } from 'react-query';

class UsersApiService {
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
    queryOptions: Omit<UseQueryOptions<ListUsersResponse, Error, ListUsersResponse, QueryKey>, 'queryKey' | 'queryFn'> = {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  ): UseQueryResult<ListUsersResponse, Error> {
    return useQuery<ListUsersResponse, Error>(['UsersService.listUsers', page], () => usersApiService.listUsers(page), queryOptions);
  },
};
