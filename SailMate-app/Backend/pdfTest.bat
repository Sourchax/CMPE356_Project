@echo off
echo Cleaning old .class files...
del /s /q out\*.class > nul 2>&1

echo Compiling Java files properly with source root...

javac -cp "lib/*" -d out ^
src\main\java\group12\Backend\service\TicketPDFGenerator.java ^
src\test\java\group12\Backend\PDFTest.java

if %errorlevel% neq 0 (
    echo ❌ Compilation failed.
    pause
    exit /b
)

echo ✅ Compilation successful. Running test...

java -cp "out;lib/*" group12.Backend.PDFTest

echo Opening generated PDF...
start "" "out\output\multiple_tickets.pdf"
pause
