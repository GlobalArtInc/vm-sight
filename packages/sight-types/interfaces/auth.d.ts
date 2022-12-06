export {User, AuthState}

interface User {
    id: string;
    username: string;
    password: string;
    locale: string;
    role: number;
    createdAt: Date;
    updatedAt: Date;
}

interface AuthState {
    isLogged: boolean;
    user: User | null;
}
