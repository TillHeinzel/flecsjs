#include <emscripten/bind.h>

#include "flecs.h"

#include <cstdint>
#include <string>

namespace {

class World {
 public:
  World() : restServer(ecs_rest_server_init(world, nullptr)) {
    world.import<flecs::stats>();
  }

  ~World() {
    if (restServer != nullptr) ecs_rest_server_fini(restServer);
  }

  World(const World&) = delete;
  World& operator=(const World&) = delete;

  std::string explorerRequest(const std::string& method,
                              const std::string& request,
                              const std::string& body) {
    ecs_http_reply_t reply = ECS_HTTP_REPLY_INIT;
    ecs_http_server_request(restServer, method.c_str(), request.c_str(),
                            body.empty() ? nullptr : body.c_str(), &reply);

    char* raw = ecs_strbuf_get(&reply.body);
    std::string result;
    if (raw != nullptr) {
      result = raw;
      ecs_os_free(raw);
    } else if (reply.code != 200) {
      result = "{\"error\": \"bad request\", \"status\": " +
               std::to_string(reply.code) + "}";
    }
    return result;
  }

  bool registerStringComponent(const std::string& name) {
    // TODO: implement
    (void)name;
    return false;
  }

  bool progress(double deltaTime) { return world.progress(static_cast<float>(deltaTime)); }

  // `fn` is the address of a `bool(flecs::world&)` function in the same wasm
  // image, as handed out by the image's own bindings.
  bool callNative(uintptr_t fn) {
    return reinterpret_cast<bool (*)(flecs::world&)>(fn)(world);
  }

 private:
  flecs::world world;
  ecs_http_server_t* restServer;
};

}  // namespace

EMSCRIPTEN_BINDINGS(flecsjs) {
  emscripten::class_<World>("World")
      .constructor<>()
      .function("explorerRequest", &World::explorerRequest)
      .function("registerStringComponent", &World::registerStringComponent)
      .function("callNative", &World::callNative)
      .function("progress", &World::progress);
}
