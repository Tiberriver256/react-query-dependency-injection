import { UsersServiceImplementation, User, ListUsersResponse } from "../users-service";

export class UsersApiService implements UsersServiceImplementation {
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
