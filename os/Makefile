OS := $(shell uname -s)

ifeq ($(OS),Darwin) # macOS
include Makefile.macos
else
$(error Unhandled OS)
endif
