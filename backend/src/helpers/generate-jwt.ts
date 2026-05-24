import jwt from "jsonwebtoken";

const generateJWT = (uid: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { uid },
      process.env.JWT_KEY || "",
      {
        expiresIn: "7d",
      },
      (error: unknown, token) => {
        if (error) {
          console.log(error);
          reject("Error generating token");
        } else {
          if (token) resolve(token);
        }
      },
    );
  });
};

export default generateJWT;
