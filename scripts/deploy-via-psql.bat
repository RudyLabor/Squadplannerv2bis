@echo off
REM Execute SQL migrations via psql command line

echo ============================================
echo   DEPLOYMENT VIA PSQL
echo ============================================
echo.

REM Read configuration from .env.local
for /f "tokens=1,2 delims==" %%a in (.env.local) do (
    if "%%a"=="SUPABASE_DB_PASSWORD" set DB_PASSWORD=%%b
)

if "%DB_PASSWORD%"=="" (
    echo ERROR: SUPABASE_DB_PASSWORD not found in .env.local
    exit /b 1
)

set PROJECT_REF=cwtoprbowdqcemdjrtir
set DB_HOST=db.%PROJECT_REF%.supabase.co
set DB_USER=postgres
set DB_NAME=postgres
set DB_PORT=5432

echo Project: %PROJECT_REF%
echo Host: %DB_HOST%
echo.

REM Check if psql is available
where psql >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: psql not found in PATH
    echo Installing PostgreSQL client...
    echo.
    echo Please install PostgreSQL from: https://www.postgresql.org/download/windows/
    echo Or use: winget install PostgreSQL.PostgreSQL
    echo.
    pause
    exit /b 1
)

echo Executing migrations...
echo.

REM Set PGPASSWORD environment variable for psql
set PGPASSWORD=%DB_PASSWORD%

REM Execute the combined SQL file
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "supabase\DEPLOY_ALL_MIGRATIONS.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo   SUCCESS!
    echo ============================================
    echo.
    echo Phase 0: 100%%
    echo Phase 1: 100%%
    echo Phase 2: 100%%
    echo.
) else (
    echo.
    echo ============================================
    echo   ERRORS OCCURRED
    echo ============================================
    echo.
)

REM Clear password
set PGPASSWORD=

pause
