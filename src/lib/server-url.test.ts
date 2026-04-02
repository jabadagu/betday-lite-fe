import { describe, expect, it, vi } from "vitest";

const { headersMock } = vi.hoisted(() => ({
  headersMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: headersMock,
}));

import { getServerBaseUrl } from "./server-url";

describe("getServerBaseUrl", () => {
  it("usa los headers forwardeados cuando existen", async () => {
    headersMock.mockResolvedValue({
      get: (name: string) => {
        if (name === "x-forwarded-host") return "example.com";
        if (name === "x-forwarded-proto") return "https";
        return null;
      },
    });

    await expect(getServerBaseUrl()).resolves.toBe("https://example.com");
  });

  it("cae al valor publico configurado cuando no hay host", async () => {
    headersMock.mockResolvedValue({
      get: () => null,
    });

    await expect(getServerBaseUrl()).resolves.toBe("http://localhost:3000");
  });
});
