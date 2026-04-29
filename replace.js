const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

const newContent = lines.slice(0, 348).join('\n') + `
                    <div class="bank-info" style="margin-top: 20px; text-align: center;">
                        <p style="font-size: 0.9em; color: var(--text-muted);">*Catatan: Harga di atas hanya estimasi. Harga akhir akan dikonfirmasi oleh Admin.</p>
                    </div>
                </div>

                <div class="receipt-actions">
                    <button id="btn-whatsapp" class="btn btn-primary btn-block"><i class="fab fa-whatsapp" style="font-size: 1.2rem; margin-right: 5px;"></i> Hubungi Admin via WA</button>
                </div>` + '\n' + lines.slice(406).join('\n');

fs.writeFileSync('index.html', newContent);
console.log('HTML replaced');
