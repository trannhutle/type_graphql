import { MyContext } from "./../../types/MyContext";
import { Resolver, Query, Ctx } from "type-graphql";
import { User } from "./../../entity/User";

@Resolver()
export class MeResolver {
  /* We can override the function name  */
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }
    return User.findOne(ctx.req.session!.userId);
  }
}
