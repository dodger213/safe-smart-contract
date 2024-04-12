JQ ?= jq

SAFEYULROOT ?=
SAFEYULBASE := build/yul/Safe.json
SAFEYUL     := $(SAFEYULROOT)/$(SAFEYULBASE)

contracts/SafeBytecode.sol: $(SAFEYUL)
	@echo '// SPDX-License-Identifier: LGPL-3.0-only' >$@
	@echo 'pragma solidity >=0.7.0 <0.9.0;' >>$@
	@echo '' >>$@
	@echo 'contract SafeBytecode {' >>$@
	@echo '    bytes public constant DEPLOYED_BYTECODE =' >>$@
	@echo '        hex$(shell $(JQ) '.evm.deployedBytecode.object' $<);' >>$@
	@echo '}' >>$@

.PHONY: $(SAFEYUL)
$(SAFEYUL):
	@test -n "$(SAFEYULROOT)" || ( echo 'SAFEYULROOT not specified'; exit 1 )
	@$(MAKE) -C $(SAFEYULROOT) $(SAFEYULBASE)