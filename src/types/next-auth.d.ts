import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface User {
        id: string
        fullname: string
        email: string
        image?: string
    }
    interface Session {
        user: User
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        fullname: string
        email: string
        image?: string
    }
}