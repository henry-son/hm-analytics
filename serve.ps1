# serve.ps1 — thin wrapper that delegates to serve-8001.ps1 when available
if (Test-Path "$PSScriptRoot\serve-8001.ps1") {
  Write-Output "Delegating to serve-8001.ps1...";
  powershell -ExecutionPolicy Bypass -File "$PSScriptRoot\serve-8001.ps1";
  exit
}

# Fallback simple static server on port 8000 (keeps old behavior)
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8000/")
$listener.Start()
Write-Output "Serving http://localhost:8000/ (Ctrl+C to stop)"
Start-Process "http://localhost:8000/"
try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $localPath = $request.Url.LocalPath.TrimStart('/')
    if ($localPath -eq '') { $localPath = 'index.html' }
    $file = Join-Path (Get-Location) $localPath
    if (Test-Path $file) {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $context.Response.ContentLength64 = $bytes.Length
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $context.Response.StatusCode = 404
      $buf = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $context.Response.OutputStream.Write($buf, 0, $buf.Length)
    }
    $context.Response.OutputStream.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
