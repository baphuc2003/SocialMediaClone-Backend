import { SignOptions } from "jsonwebtoken";
import { TokenType } from "src/constants/token.enum";
import { Permissions, Status } from "src/constants/user.enum";
export interface ITypeToken {
    type: TokenType;
    userId: string;
    permissions?: Permissions;
    status: Status | string;
    created_at?: Date;
}
export declare function generateToken({ payload, signature, options, }: {
    payload: ITypeToken;
    signature: string;
    options?: SignOptions;
}): Promise<unknown>;
export declare function verifyToken({ token, signature, }: {
    token: string;
    signature: string;
}): Promise<unknown>;
export declare function decodedToken(token: string): Promise<unknown>;
