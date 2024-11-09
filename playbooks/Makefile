VENV = venv
VENV_BIN = $(VENV)/bin

PIP := $(VENV_BIN)/pip3
ANSIBLE_PLAYBOOK := $(VENV_BIN)/ansible-playbook
ANSIBLE_GALAXY := $(VENV_BIN)/ansible-galaxy

#
# Run playbook against test environment.
# Before runing this tragte make sure local k3s cluster started. Check
# ../development/Makefile for details.
#
.PHONY: run/test
run/test:
	$(ANSIBLE_PLAYBOOK) -i inventory/test --extra-vars "env=test" master.yml

#
# Install all required dependencies.
#
deps: $(VENV_BIN)/activate
	$(PIP) install -r requirements.txt
	$(ANSIBLE_GALAXY) collection install -r requirements.yml

#
# Setup virtual environment for python.
#
$(VENV_BIN)/activate:
	virtualenv $(VENV)
