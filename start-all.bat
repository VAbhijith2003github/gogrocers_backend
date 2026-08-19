@echo off
echo Starting GoGrocers Scalable Backend Microservices...

:: ─── User Service (Ports 3001 & 3011) ───
echo Starting User Service instances...
start "User Service (3001)" cmd /k "cd /d "%~dp0user-service" && set PORT=3001 && node src/server.js"
start "User Service (3011)" cmd /k "cd /d "%~dp0user-service" && set PORT=3011 && node src/server.js"

:: ─── Cart Service (Ports 3002 & 3012) ───
echo Starting Cart Service instances...
start "Cart Service (3002)" cmd /k "cd /d "%~dp0cart-service" && set PORT=3002 && node src/server.js"
start "Cart Service (3012)" cmd /k "cd /d "%~dp0cart-service" && set PORT=3012 && node src/server.js"

:: ─── Order Service (Ports 3003 & 3013) ───
echo Starting Order Service instances...
start "Order Service (3003)" cmd /k "cd /d "%~dp0order-service" && set PORT=3003 && node src/server.js"
start "Order Service (3013)" cmd /k "cd /d "%~dp0order-service" && set PORT=3013 && node src/server.js"

:: ─── Query Service (Ports 3004 & 3014) ───
echo Starting Query Service instances...
start "Query Service (3004)" cmd /k "cd /d "%~dp0query-service" && set PORT=3004 && node src/server.js"
start "Query Service (3014)" cmd /k "cd /d "%~dp0query-service" && set PORT=3014 && node src/server.js"

:: ─── Mailer Service (Kafka Consumer) ───
echo Starting Mailer Service (Kafka Consumer)...
start "Mailer Service" cmd /k "cd /d "%~dp0mailer-service" && node src/server.js"

echo.
echo All microservice instances started!
echo.
echo Primary Ports:
echo   User Service:  http://localhost:3001
echo   Cart Service:  http://localhost:3002
echo   Order Service: http://localhost:3003
echo   Query Service: http://localhost:3004
echo.
echo Scaled Ports:
echo   User Service:  http://localhost:3011
echo   Cart Service:  http://localhost:3012
echo   Order Service: http://localhost:3013
echo   Query Service: http://localhost:3014
echo.
echo API Gateway / Reverse Proxy (NGINX on port 80):
echo   To launch NGINX:
echo     nginx\nginx.exe -c nginx\nginx.conf
echo.
pause
