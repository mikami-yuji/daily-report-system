' Daily Report System Stop Script
' Double-click to stop backend and frontend processes

Set WshShell = CreateObject("WScript.Shell")

' Kill Python (backend) and Node (frontend) processes
WshShell.Run "taskkill /F /IM python.exe", 0, True
WshShell.Run "taskkill /F /IM node.exe", 0, True

MsgBox "Daily Report System Stopped!", vbInformation, "Daily Report System"
