set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Object library, so the embind registrations in World.cpp are always linked
# into the final image instead of being dropped from a static archive.
add_library(flecs_wrapper OBJECT World.cpp)
add_subdirectory(flecs)

target_include_directories(flecs_wrapper PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_link_libraries(flecs_wrapper PUBLIC embind flecs)
target_link_options(flecs_wrapper PUBLIC
  -sMODULARIZE=1
  -sEXPORT_ES6=1
  -sALLOW_MEMORY_GROWTH=1
  -sSTACK_SIZE=1mb
  -sENVIRONMENT=web,node
  -sASSERTIONS=1
)
