import Credentials from "next-auth/providers/credentials";
import { loginUser } from "./actions/auth-user";

const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const result = await loginUser({
          username: credentials.username as string,
          password: credentials.password as string,
        });

        if (result.error) {
          console.log(result.error);
        }

        if (result.data && !result.error && result.success) {
          return result.data;
        }

        return null;
      },
    }),
  ],
};

export default authConfig;
