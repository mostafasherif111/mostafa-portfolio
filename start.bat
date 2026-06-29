@echo off
cd /d E:\PROGRAMMING\proto

call .\.bin\node-v20.12.2-win-x64\npm.cmd run dev

start http://localhost:3000

pause
