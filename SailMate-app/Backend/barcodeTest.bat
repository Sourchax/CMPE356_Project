@echo off
echo Compiling Java files...

javac -cp "lib/core-3.5.2.jar;lib/javase-3.5.2.jar;lib/mysql-connector-j-8.3.0.jar" -d out ^
src\main\java\group12\Backend\repository\TicketRepository.java ^
src\main\java\group12\Backend\service\TicketService.java ^
src\main\java\group12\Backend\service\BarcodeGeneratorService.java ^
src\test\java\group12\Backend\BarcodeTest.java

if %errorlevel% neq 0 (
    echo Compilation failed.
    exit /b
)

echo Compilation successful. Running test...

cd out
java -cp ".;../lib/core-3.5.2.jar;../lib/javase-3.5.2.jar;../lib/mysql-connector-j-8.3.0.jar" group12.Backend.BarcodeTest
cd ..
pause