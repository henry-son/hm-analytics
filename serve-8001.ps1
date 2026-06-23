# Try to bind to an available port from the preferred list
$preferredPorts = @(8001,8002,8003,8004,8005)
$listener = $null
$port = $null
foreach ($p in $preferredPorts) {
  $prefix = "http://localhost:$p/"
  try {
    $temp = New-Object System.Net.HttpListener
    $temp.Prefixes.Add($prefix)
    $temp.Start()
    $listener = $temp
    $port = $p
    break
  } catch {
    try { $temp.Stop(); $temp.Close() } catch {}
    continue
  }
}
if (-not $listener) {
  Write-Error "Could not bind to any ports: $($preferredPorts -join ', '). Check for conflicts or run as Administrator to modify URL reservations."
  exit 1
}
 $prefix = "http://localhost:$port/"
Write-Output "Serving $prefix (Ctrl+C to stop)"
Write-Output "Open your browser to: http://localhost:$port/"
try {
  while ($listener.IsListening) {
    try {
      $context = $listener.GetContext()
      $request = $context.Request
      $localPath = $request.Url.LocalPath.TrimStart('/')
      if ($localPath -eq '') { $localPath = 'index.html' }
      $file = Join-Path (Get-Location) $localPath
      if (Test-Path $file) {
        $ext = [System.IO.Path]::GetExtension($file).ToLower()
        switch ($ext) {
          '.html' { $context.Response.ContentType = 'text/html; charset=utf-8' }
          '.htm'  { $context.Response.ContentType = 'text/html; charset=utf-8' }
          '.css'  { $context.Response.ContentType = 'text/css; charset=utf-8' }
          '.js'   { $context.Response.ContentType = 'application/javascript; charset=utf-8' }
          '.svg'  { $context.Response.ContentType = 'image/svg+xml' }
          '.png'  { $context.Response.ContentType = 'image/png' }
          '.jpg'  { $context.Response.ContentType = 'image/jpeg' }
          '.jpeg' { $context.Response.ContentType = 'image/jpeg' }
          '.gif'  { $context.Response.ContentType = 'image/gif' }
          '.json' { $context.Response.ContentType = 'application/json; charset=utf-8' }
          '.txt'  { $context.Response.ContentType = 'text/plain; charset=utf-8' }
          '.ico'  { $context.Response.ContentType = 'image/x-icon' }
          default { $context.Response.ContentType = 'application/octet-stream' }
        }
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $context.Response.ContentLength64 = $bytes.Length
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
      } else {
        $context.Response.StatusCode = 404
        $buf = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $context.Response.OutputStream.Write($buf, 0, $buf.Length)
      }
      $context.Response.OutputStream.Close()
    } catch {
      Write-Output "[Error handling request] $_"
      try { $context.Response.Close() } catch {}
    }
  }
} catch {
  Write-Output "[Fatal error] $_"
} finally {
  $listener.Stop()
  $listener.Close()
}
