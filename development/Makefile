CLUSTER_NAME = test

ifeq (, $(shell which k3d))
$(error "k3d not found, plese install it (https://k3d.io/v5.7.4/#installation)")
endif

ifeq ($(CLUSTER_NAME), $(shell k3d cluster list --no-headers | cut -d ' ' -f 1 | grep $(CLUSTER_NAME) | tr -d '\n' ))
CLUSTER_CREATED = 1
endif

#
# Run k3s development cluster.
#
.PHONY: start
start: create
	k3d cluster start $(CLUSTER_NAME)

#
# Stop k3s development cluster.
#
.PHONY: stop
stop:
ifdef CLUSTER_CREATED
	k3d cluster stop $(CLUSTER_NAME)
endif

#
# Create k3s development cluster.
#
.PHONY: create
create:
ifndef CLUSTER_CREATED
	k3d cluster create $(CLUSTER_NAME) --wait
endif

#
# Destroy k3s development cluster.
#
.PHONY: destroy
destroy:
ifdef CLUSTER_CREATED
	k3d cluster delete $(CLUSTER_NAME)
endif
