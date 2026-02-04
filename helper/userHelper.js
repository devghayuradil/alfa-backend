import bcrypt from "bcrypt";

const encryptPassword = async (plainPassword) => {
  const saltRounds = 10;
  const encrptedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return encrptedPassword;
};

const decryptPassword = async (plainPassword, encryptPassword) => {
  return await bcrypt.compare(plainPassword, encryptPassword)
}


export {encryptPassword, decryptPassword};