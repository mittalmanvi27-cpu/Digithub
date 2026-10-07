@echo off
title Digitroot - local server (close this window to stop)
cd /d "%~dp0"
python -c "import anthropic" 2>nul || (
  echo Installing dependencies...
  python -m pip install --quiet -r requirements.txt
)
start "" "http://localhost:5500/"
python server\app.py
pause
