import { withAuth } from "next-auth/middleware";
import { ENV } from "@betday/config/env";

export default withAuth({
  secret: ENV.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/profile/:path*", "/bets/:path*"],
};
