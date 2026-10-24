import { pathToFileURL } from "node:url";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { loadModule } from "./loadModule";
import { World } from "./World";

const moduleUrl = pathToFileURL(
  path.resolve(__dirname, "../build/flecs_wrapper_exe.js"),
).href;
const moduleReturn = await loadModule(moduleUrl);

describe("load module", () => {
  test("succeeds", () => {
    expect(moduleReturn).toMatchObject({ status: "success" });
  });
});

describe("world wrapper", () => {
  let world: World;

  beforeEach(() => {
    if (moduleReturn.status !== "success") throw new Error(moduleReturn.error);
    world = new World(moduleReturn.backendModule);
  });

  afterEach(() => {
    world.delete();
  });

  test("progresses", () => {
    expect(world.progress(0)).toBe(true);
  });

  test("answers explorer requests", () => {
    const reply = world.explorerRequest("GET", "/world");
    expect(JSON.parse(reply)).toBeObject();
  });
});
