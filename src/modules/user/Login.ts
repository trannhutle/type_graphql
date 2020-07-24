import { MyContext } from "./../../types/MyContext";
import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "./../../entity/User";

@Resolver()
export class LoginResolver {
  /* We can override the function name  */
  @Query(() => String)
  @Mutation(() => User)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return null;
    }
    ctx.req.session!.userId = user.id;
    return user;
  }
}
