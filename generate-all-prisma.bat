@echo off
for /r "prisma" %%F in (*.prisma) do (
    echo Running prisma generate for %%F
    npx prisma generate --schema="%%F"
)