$response = Invoke-RestMethod -Method Post -Uri "https://si-8d2b91972c694c15850c6454045d57cd.ecs.us-east-2.on.aws/api/auth/login" -ContentType "application/json" -Body '{"Usuario":"admin","Contrasena":"admin123"}' -ErrorAction Stop
$token = $response.token
if (!$token) {
    $token = $response
}
Write-Host "Token: $token"

$headers = @{ "Authorization" = "Bearer $token" }

$inmuebles = Invoke-RestMethod -Method Get -Uri "https://si-8d2b91972c694c15850c6454045d57cd.ecs.us-east-2.on.aws/api/inmuebles" -Headers $headers
Write-Host "Inmueble ID: "

$inquilinos = Invoke-RestMethod -Method Get -Uri "https://si-8d2b91972c694c15850c6454045d57cd.ecs.us-east-2.on.aws/api/inquilinos" -Headers $headers
Write-Host "Inquilino ID: "

$body = @{
    IdInquilino = $inquilinos[0].idInquilino
    IdInmueble = $inmuebles[0].idInmueble
    FechaInicio = "2026-06-01"
    FechaVcmto = "2027-06-01"
    RentaMensual = 1000
    NroMeses = 12
    NroMesPPago = 12
} | ConvertTo-Json

try {
    $postResponse = Invoke-RestMethod -Method Post -Uri "https://si-8d2b91972c694c15850c6454045d57cd.ecs.us-east-2.on.aws/api/contratos" -Headers $headers -ContentType "application/json" -Body $body
    $postResponse | ConvertTo-Json
} catch {
    $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $streamReader.ReadToEnd()
}
