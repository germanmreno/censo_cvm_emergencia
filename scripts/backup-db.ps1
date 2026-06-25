#Requires -Version 5.1
$ErrorActionPreference = "Stop"

$envPath = Join-Path $PSScriptRoot "..\backend\.env"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)=(.*)$') {
            $name = $matches[1].Trim()
            $val = $matches[2].Trim().Trim('"').Trim("'")
            Set-Item -Path "Env:$name" -Value $val
        }
    }
}

if (-not $env:DATABASE_URL) { throw "DATABASE_URL no definida en backend/.env" }

$uri = [System.Uri]$env:DATABASE_URL
$host = if ($uri.Host) { $uri.Host } else { "localhost" }
$port = if ($uri.Port -gt 0) { $uri.Port } else { 5432 }
$user = if ($uri.UserInfo) { ($uri.UserInfo -split ':')[0] } else { "postgres" }
$pass = if ($uri.UserInfo) { ($uri.UserInfo -split ':')[1] } else { "" }
$db   = $uri.AbsolutePath.TrimStart('/')

$env:PGPASSWORD = $pass
$backupDir = Join-Path $PSScriptRoot "..\backups"
if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }

$ts = Get-Date -Format "yyyyMMdd-HHmmss"
$file = Join-Path $backupDir "censo_emergencia-$ts.sql"

$env:Path = "$env:Path;C:\Program Files\PostgreSQL\16\bin"
& pg_dump.exe -h $host -p $port -U $user -d $db -F c -f $file

Write-Host "Backup OK: $file" -ForegroundColor Green

Get-ChildItem -Path $backupDir -Filter "censo_emergencia-*.sql" |
    Sort-Object LastWriteTime -Descending |
    Select-Object -Skip 7 |
    ForEach-Object { Remove-Item $_.FullName -Force }
