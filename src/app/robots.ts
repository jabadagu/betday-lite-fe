import type { MetadataRoute } from "next";

import { ENV } from "@betday/config/env";

export default function robots(): MetadataRoute.Robots {
  const appUrl = new URL(ENV.NEXT_PUBLIC_APP_URL);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/profile", "/profile/", "/bets", "/bets/", "/api"],
      },
    ],
    sitemap: new URL("/sitemap.xml", appUrl).toString(),
  };
}
