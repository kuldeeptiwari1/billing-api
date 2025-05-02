#!/bin/bash

# Find all .prisma files in subdirectories of prisma/ and run prisma generate for each
find prisma -type f -name "*.prisma" | while read schemaFile; do
  echo "Running prisma generate for $schemaFile"
  npx prisma generate --schema="$schemaFile"
done