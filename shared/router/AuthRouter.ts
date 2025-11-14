import { BaseRouterInstance } from "../lib/decorator";

export class AuthRouterInstance extends BaseRouterInstance {
    base = "/api";
    prefix = "/auth";
    router = [
        {
            name: "login",
            path: "/login",
            method: "post",
            handler: Function,
        },
        {
            name: "register",
            path: "/register",
            method: "post",
            handler: Function,
        },
        {
            name: "code",
            path: "/code",
            method: "post",
            handler: Function,
        },
    ];

    login: (request: AuthBody, callback?: Function) => Promise<LoginToken>;
    register: (request: AuthBody, callback?: Function) => Promise<RegisterResult>;
    code: (request: CodeLogin, callback?: Function) => Promise<LoginToken>;

    constructor(
        inject: Function,
        functions?: {
            login: (request: AuthBody) => Promise<LoginToken>;
            register: (request: AuthBody) => Promise<RegisterResult>;
            code: (request: CodeLogin) => Promise<LoginToken>;
        },
    ) {
        super();
        inject(this, functions);
    }
}

export interface AuthBody {
    name?: string;
    email?: string;
    password?: string;
}

export interface LoginToken {
    token: string;
    success: boolean;
}

export interface RegisterResult {
    success: boolean;
}

export interface CodeLogin {
    code: string;
}
