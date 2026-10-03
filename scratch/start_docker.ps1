Write-Host "Resetting WSL..."
wsl --shutdown
Start-Sleep -Seconds 2

Write-Host "Launching Docker Desktop..."
Start-Process "C:\Users\USER\AppData\Local\Programs\DockerDesktop\Docker Desktop.exe"

$maxAttempts = 10
$attempt = 1
$connected = $false

while ($attempt -le $maxAttempts) {
    Write-Host "Polling Docker Engine (Attempt $attempt of $maxAttempts)..."
    $info = docker info 2>&1
    if ($LASTEXITCODE -eq 0 -and $info -like "*Server:*") {
        Write-Host "SUCCESS: Docker Engine is active!"
        $connected = $true
        break
    }
    Start-Sleep -Seconds 3
    $attempt++
}

if (-not $connected) {
    Write-Host "FAILED: Docker Engine could not be reached after 30 seconds."
}
