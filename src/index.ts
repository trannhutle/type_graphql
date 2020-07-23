import "reflect-metadata";
import * as Express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema, Resolver, Query } from "type-graphql";

@Resolver()
class RecipeResolver {
  /* We can override the function name  */
  @Query(() => String)
  async helloWorld() {
    return "Hello world";
  }
}

const main = async () => {
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
  });

  const apolloServer = new ApolloServer({ schema });

  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server statted on http:localhost:4000/graphql");
  });
};
main();
