import * as bcrypt from "bcrypt";

const saltRounds = 10;

export function hashPassword(myPassword: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(myPassword, saltRounds, (err, hash) => {
      if (err) {
        return reject(err);
      }
      return resolve(hash);
    });
  });
}

export function comparePassword(
  myPassword: string,
  hashPassword: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(myPassword, hashPassword, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}
