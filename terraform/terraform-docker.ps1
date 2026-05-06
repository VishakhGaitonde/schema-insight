# Terraform Docker wrapper script for Windows PowerShell
# Usage: .\terraform-docker.ps1 init
#        .\terraform-docker.ps1 plan
#        .\terraform-docker.ps1 validate

param(
    [string]$Command = "help",
    [string[]]$Args = @()
)

$TerraformDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DockerImage = "hashicorp/terraform:latest"
$DockerCmd = @(
    "docker", "run", "-it", "--rm",
    "-v", "$($TerraformDir):/terraform",
    "-w", "/terraform"
)

# Add AWS credentials if available
if (Test-Path "$env:USERPROFILE\.aws") {
    $DockerCmd += "-v", "$env:USERPROFILE/.aws:/root/.aws:ro"
}

# Add environment variables
$DockerCmd += "-e", "AWS_REGION=ap-south-1"
$DockerCmd += $DockerImage
$DockerCmd += $Command
$DockerCmd += $Args

Write-Host "Running Terraform in Docker: $Command $Args" -ForegroundColor Green
Write-Host "Command: $($DockerCmd -join ' ')" -ForegroundColor Yellow
Write-Host ""

& $DockerCmd[0] @($DockerCmd[1..($DockerCmd.Count-1)])
