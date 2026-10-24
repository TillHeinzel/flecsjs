export interface BackendWorld {
  delete(): void;
  progress(deltaTimeMs: number): boolean;
  explorerRequest(method: string, request: string, body: string): string;
  registerStringComponent(name: string): boolean;
  callNative(fn: number): boolean;
}

/** The part of a wasm image's module that flecsjs relies on. */
export interface FlecsModule {
  World: new () => BackendWorld;
}

/** Names of the module's exports that return the address of a native `bool(flecs::world&)` function. */
export type NativeFunctionName<M> = {
  [K in keyof M]: M[K] extends () => number ? K : never;
}[keyof M] &
  string;

export class World<M extends FlecsModule = FlecsModule> {
  private backend: BackendWorld;

  constructor(private mainModule: M) {
    this.backend = new mainModule.World();
  }

  delete() {
    this.backend.delete();
  }

  progress(deltaTimeMs: number) {
    return this.backend.progress(deltaTimeMs);
  }

  explorerRequest(method: string, request: string, body: string = "") {
    return this.backend.explorerRequest(method, request, body);
  }

  /** Runs a native function of the wasm image against this world. */
  callNative(name: NativeFunctionName<M>): boolean {
    const getAddress = this.mainModule[name] as unknown as () => number;
    return this.backend.callNative(getAddress());
  }
}
