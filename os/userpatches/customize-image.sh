#!/bin/bash

# arguments: $RELEASE $LINUXFAMILY $BOARD $BUILD_DESKTOP
#
# This is the image customization script

# NOTE: It is copied to /tmp directory inside the image
# and executed there inside chroot environment
# so don't reference any files that are not already installed

# NOTE: If you want to transfer files between chroot and host
# userpatches/overlay directory on host is bind-mounted to /tmp/overlay in chroot
# The sd card's root path is accessible via $SDCARD variable.

RELEASE=$1
# LINUXFAMILY=$2
# BOARD=$3
# BUILD_DESKTOP=$4

function main() {
	if [ "$RELEASE" != "jammy" ]; then
		echo "Only Ubuntu 22.04 supported."
		exit 1
	fi

	# Подключаем файл с переменными.
	# shellcheck disable=SC1091
	source /tmp/overlay/variables.sh

	setup_users
	fix_armbian_env
}

function setup_users() {
	# Устанавливаем пароль рута.
	rm /root/.not_logged_in_yet
	echo root:"$ROOT_PASSWORD" | chpasswd
}

# Правит переменные окруженя в соответствии с рекомендациями:
# https://armbian.com/orangepi-5/
#
#    f you are having a Orange Pi 5B variant, replace fdtfile=rockchip/rk3588s-orangepi-5.dtb
#    in /boot/armbianEnv.txt with fdtfile=rockchip/rk3588s-orangepi-5b.dtb
#
function fix_armbian_env() {
	sed -i 's/orangepi-5\.dtb/orangepi-5b.dtb/' /boot/armbianEnv.txt
}

#
# Старт конфигурации.
#

ain "$@"
