import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roles: string[];
    };
    access_token: string;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roles: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: string[];
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
  }
}
