#!/bin/sh

# Run the actual audit
# TODO grep only the high and critical errors
yarn audit

# Get the exit code of the audit
yarnCode=$?

# return code >= 4 means moderate, high or critical errors
# as per https://classic.yarnpkg.com/en/docs/cli/audit/
if [ "$yarnCode" -ge 4 ]; then
  exit 1
fi

# Ignore medium and low errors
exit 0
