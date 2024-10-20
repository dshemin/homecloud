ROOT_DIR = $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
PATH_TO_VARAIBLES_FILE = $(ROOT_DIR)/userpatches/overlay/variables.sh

# Запускает сборку образа ОС для OrangePI 5b
.PHONY: run
run:
ifeq ("$(wildcard $(PATH_TO_VARAIBLES_FILE))","")
    $(error "File $(PATH_TO_VARAIBLES_FILE) not found")
endif
	cp -r ./userpatches/ ./armbian/userpatches/
	./armbian/compile.sh build \
		BOARD=orangepi5 \
		BRANCH=legacy \
		BUILD_DESKTOP=no \
		BUILD_MINIMAL=yes \
		KERNEL_CONFIGURE=no \
		KERNEL_GIT=shallow \
		DISABLE_IPV6=false \
		RELEASE=jammy \
		CONSOLE_AUTOLOGIN=no

.PHONY: lint
lint:
	shellcheck userpatches/customize-image.sh