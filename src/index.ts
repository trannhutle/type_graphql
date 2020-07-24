import { MeResolver } from "./modules/user/Me";
import { LoginResolver } from "./modules/user/Login";
import "reflect-metadata";
import Express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { RegisterResolver } from "./modules/user/Register";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from "cors";

const main = async () => {
  await createConnection();
  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req }),
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret:
        "SESSION_SECRET_skfhjksdfhjkshfjksdhfjksdhfjkahflka hlaksjhflkja  alkjsad hklasd hf",
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 24 * 7 * 365,
      },
    })
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server statted on http:localhost:4000/graphql");
  });
};
main();
