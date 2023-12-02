import bcrypt from 'bcryptjs';

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const hashPassword = (password: string): string => bcrypt.hashSync(password, salt);
const comparePassword = (password: string, hashedPassword: string): boolean =>
  bcrypt.compareSync(password, hashedPassword);

export {
  hashPassword,
  comparePassword,
};
