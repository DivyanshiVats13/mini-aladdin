@REM Maven Wrapper startup batch script
@REM ---------------------------------------------------------------------------
@REM This script downloads Maven if not present and runs it.
@REM ---------------------------------------------------------------------------

@echo off
setlocal

set "MAVEN_PROJECTBASEDIR=%~dp0"
set "WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.properties"

@REM Determine Maven home
if not defined MAVEN_HOME (
    set "MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.9"
)

set "MAVEN_CMD=%MAVEN_HOME%\bin\mvn.cmd"

@REM Download Maven if not present
if not exist "%MAVEN_CMD%" (
    echo Maven not found at %MAVEN_HOME%, downloading...
    
    @REM Create directory
    if not exist "%MAVEN_HOME%" mkdir "%MAVEN_HOME%"
    
    @REM Use PowerShell to download and extract
    powershell -Command "& { $url='https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.9/apache-maven-3.9.9-bin.zip'; $out='%TEMP%\maven.zip'; Invoke-WebRequest -Uri $url -OutFile $out; Expand-Archive -Path $out -DestinationPath '%USERPROFILE%\.m2\wrapper\dists' -Force; Remove-Item $out }"
    
    @REM Maven extracts into a subfolder, move contents up if needed
    if exist "%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.9\bin\mvn.cmd" (
        set "MAVEN_CMD=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.9\bin\mvn.cmd"
    )
)

@REM Run Maven with all arguments
"%MAVEN_CMD%" %*
