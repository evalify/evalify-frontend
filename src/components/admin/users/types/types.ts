export interface User {
  id: string;
  name: string;
  email: string;
  profileId?: string;
  image?: string;
  role: "STUDENT" | "ADMIN" | "FACULTY" | "MANAGER";
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  password: string;
  isActive: boolean;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
}
