@echo off
title TALENTIA - Demo local
cd /d "%~dp0"
echo Iniciando TALENTIA. Mantenga esta ventana abierta mientras usa el demo.
echo Abra en su navegador la direccion Local que aparece a continuacion.
if not exist node_modules (
  echo Primero instale las dependencias con npm install en esta carpeta.
  pause
  exit /b 1
)
if not exist dist\server\index.js (
  call npm.cmd run build
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
call npm.cmd start
pause
