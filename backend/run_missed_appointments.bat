@echo off
REM This batch file should be in the backend folder
REM Change to the current directory (where this bat file is located)
cd /d "%~dp0"

REM Activate virtual environment
call .venv\Scripts\activate.bat

REM Create logs directory if it doesn't exist
if not exist logs mkdir logs

REM Run the Django commands and log output
python manage.py update_missed_appointments >> logs\missed_appointments.log 2>&1
python manage.py send_reminders >> logs\send_reminders.log 2>&1

REM Deactivate virtual environment
deactivate

echo Commands completed at %date% %time%