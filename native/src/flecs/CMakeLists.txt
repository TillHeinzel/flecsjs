add_library(flecs STATIC flecs.c)
set_target_properties(flecs PROPERTIES C_STANDARD 99 LINKER_LANGUAGE C)
# target_compile_definitions(flecs PUBLIC flecs_STATIC)
target_include_directories(flecs PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
