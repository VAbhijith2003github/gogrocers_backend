@echo off
echo Starting GoGrocers backend servers...

:: Start instance 1 on port 3001
start "GoGrocers-3001" cmd /k "cd /d "%~dp0" && set PORT=3001 && node src/server.js"

:: Start instance 2 on port 3002
start "GoGrocers-3002" cmd /k "cd /d "%~dp0" && set PORT=3002 && node src/server.js"

:: Start instance 3 on port 3003
start "GoGrocers-3003" cmd /k "cd /d "%~dp0" && set PORT=3003 && node src/server.js"

echo.
echo All 3 servers started!
echo   Server 1: http://localhost:3001
echo   Server 2: http://localhost:3002
echo   Server 3: http://localhost:3003
echo.
echo Now start NGINX to load balance on port 80:
echo   nginx\nginx.exe -c nginx\nginx.conf
echo.
pause
