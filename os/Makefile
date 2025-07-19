LAB_IMAGE_NAME := yoctolab
LAB_IMAGE_TAG := latest
LAB_IMAGE := $(LAB_IMAGE_NAME):$(LAB_IMAGE_TAG)
LAB_VOLUME := $(LAB_IMAGE_NAME)

all:
	@echo "Not implemented"

lab: labimage
	docker volume create --name $(LAB_VOLUME)
	docker run -it -v $(LAB_VOLUME):/workdir -w /workdir $(LAB_IMAGE)
	
labimage:
	docker build . -t $(LAB_IMAGE)

.PHONY: all image lab
