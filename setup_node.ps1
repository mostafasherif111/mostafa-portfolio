# Create local bin directory
If (!(Test-Path -Path ".bin")) {
    New-Item -ItemType Directory -Force -Path ".bin" | Out-Null
}

$ZipPath = ".bin\node.zip"
$ExtractPath = ".bin"
$NodeFolder = ".bin\node-v20.12.2-win-x64"

If (!(Test-Path -Path $NodeFolder)) {
    Write-Host "Downloading local Node.js v20.12.2..."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.12.2/node-v20.12.2-win-x64.zip" -OutFile $ZipPath
    
    Write-Host "Extracting Node.js..."
    Expand-Archive -Path $ZipPath -DestinationPath $ExtractPath -Force
    
    Write-Host "Cleaning up ZIP file..."
    Remove-Item -Path $ZipPath -Force
    Write-Host "Local Node.js setup complete!"
} Else {
    Write-Host "Local Node.js already exists."
}
