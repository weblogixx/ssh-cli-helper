#!/bin/sh
if [ $# -ne 1 ]; then
  ssh-cli-helper -h
  exit 1
fi

CMDTORUN=`ssh-cli-helper -c $1`
echo "Connecting via $CMDTORUN"
$CMDTORUN > /dev/null 2>&1

if [ $? -eq 0 ]; then
  exit $?
else
  exit 1
fi
