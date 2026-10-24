import { describe, expect, test } from "vitest";
import { World } from "./testWorld";

describe("world wrapper", () => {
  test("progresses", () => {
    using world = new World();
    expect(world.progress(0)).toBe(true);
  });

  test("answers explorer requests", () => {
    using world = new World();
    const reply = world.explorerRequest("GET", "/world");
    expect(JSON.parse(reply)).toBeObject();
  });
});
