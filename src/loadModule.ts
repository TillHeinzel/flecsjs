import type { FlecsModule } from "./World";

/** Loads a wasm image's js glue from `url` at runtime (e.g. from /public) and instantiates it. */
export async function loadModule<M extends FlecsModule>(url: string) {
  try {
    const factory = (
      (await import(
        /* webpackIgnore: true */ /* turbopackIgnore: true */ /* @vite-ignore */ url
      )) as { default: () => Promise<M> }
    ).default;
    const backendModule = await factory();

    return { status: "success", backendModule } as const;
  } catch (e) {
    return { status: "error", error: `wasm failed: ${String(e)}` } as const;
  }
}
