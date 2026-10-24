cmake_minimum_required(VERSION 3.20)
project(flecsjs C CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_subdirectory(src)

# Only build a standalone wasm image (used by the tests) when flecsjs is the
# top-level project. Consumers add_subdirectory() this directory and link
# flecs_wrapper into their own image.
if(CMAKE_SOURCE_DIR STREQUAL CMAKE_CURRENT_SOURCE_DIR)
  add_executable(flecs_wrapper_exe main.cpp)
  target_link_libraries(flecs_wrapper_exe PRIVATE flecs_wrapper)
  target_link_options(flecs_wrapper_exe PRIVATE -sEXPORT_NAME=createFlecsWrapper)
  set_target_properties(flecs_wrapper_exe PROPERTIES SUFFIX ".js")
endif()
