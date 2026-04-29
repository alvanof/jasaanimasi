$content = Get-Content index.html -Raw
$content = $content -replace '<!-- Paket 1 -->\s*<div class="package-block">[\s\S]*?<!-- Paket 2 -->', 'PLACEHOLDER_PAKET2'
# Wait, I shouldn't use regex if I don't need to. I'll just read lines.
$lines = Get-Content index.html
