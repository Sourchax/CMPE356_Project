@echo off
echo Compiling Java files...

javac -cp "lib/*" -d out ^
src\main\java\group12\Backend\repository\TicketRepository.java ^
src\main\java\group12\Backend\repository\BarcodeRetrieveRepository.java ^
src\main\java\group12\Backend\service\TicketService.java ^
src\main\java\group12\Backend\service\BarcodeGeneratorService.java ^
src\test\java\group12\Backend\BarcodeTest.java

if %errorlevel% neq 0 (
    echo Compilation failed.
    pause
    exit /b
)

echo Compilation successful. Running test...

cd out
java -cp ".;../lib/*" group12.Backend.BarcodeTest
cd ..
pause
