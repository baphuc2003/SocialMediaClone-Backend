import jwt, {
  sign,
  verify,
  decode,
  SignOptions,
  JwtPayload,
} from "jsonwebtoken";
import { TokenType } from "src/constants/token.enum";
import { Permissions, Status } from "src/constants/user.enum";

export interface ITypeToken {
  type: TokenType;
  userId: string;
  permissions?: Permissions;
  status: Status | string;
  created_at?: Date;
}

const defaultTypeToken: Partial<ITypeToken> = {
  permissions: Permissions.User,
  created_at: new Date(),
};

export function generateToken({
  payload,
  signature,
  options,
}: {
  payload: ITypeToken;
  signature: string;
  options?: SignOptions;
}) {
  return new Promise((resolve, reject) => {
    sign(
      { ...payload, ...defaultTypeToken },
      signature,
      { ...options },
      (err, token) => {
        if (err) return reject(err);
        return resolve(token);
      }
    );
  });
}

export function verifyToken({
  token,
  signature,
}: {
  token: string;
  signature: string;
}) {
  return new Promise((resolve, reject) => {
    try {
      const verifiedToken = verify(token, signature, {
        algorithms: ["RS256"], // Chỉ định thuật toán
      });

      resolve(verifiedToken);
    } catch (error) {
      reject(error);
    }
  });
}

export async function decodedToken(token: string) {
  return new Promise((resolve, reject) => {
    try {
      const decodedToken = decode(token);
      resolve(decodedToken);
    } catch (error) {
      reject(error);
    }
  });
}
