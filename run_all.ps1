Start-Process powershell -ArgumentList "-NoExit -Command `"cd `$PSScriptRoot\backend_django; python manage.py runserver`""
Start-Process powershell -ArgumentList "-NoExit -Command `"cd `$PSScriptRoot\client; npm run dev`""
Start-Process powershell -ArgumentList "-NoExit -Command `"cd `$PSScriptRoot\admin-panel; npm run dev`""
