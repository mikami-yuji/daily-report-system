' Daily Report System Launcher
' Double-click to start backend, frontend, and open browser

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

scriptPath = fso.GetParentFolderName(WScript.ScriptFullName)

WshShell.CurrentDirectory = scriptPath & "\backend"
WshShell.Run "cmd /c py -m uvicorn main:app --host 0.0.0.0 --port 8001", 0, False

WScript.Sleep 2000

WshShell.CurrentDirectory = scriptPath & "\frontend"
WshShell.Run "cmd /c npm run dev", 0, False

WScript.Sleep 5000

WshShell.Run "http://localhost:3000", 1, False

MsgBox "Daily Report System Started!" & vbCrLf & vbCrLf & "Browser will open at http://localhost:3000" & vbCrLf & "System runs in background after closing this dialog.", vbInformation, "Daily Report System"
