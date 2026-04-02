import { headers } from "next/headers";

import { ENV } from "@betday/config/env";

export const getServerBaseUrl = async () => {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (host) {
    return `${proto}://${host}`;
  }

  return ENV.NEXT_PUBLIC_APP_URL;
};
