import type { MetadataRoute } from "next";

import { ENV } from "@betday/config/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = new URL(ENV.NEXT_PUBLIC_APP_URL);

  return [
    {
      url: new URL("/", appUrl).toString(),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
