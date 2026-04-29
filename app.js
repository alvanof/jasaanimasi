document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const form = document.getElementById('orderForm');
    const paketSelect = document.getElementById('paket');
    const durasiInput = document.getElementById('durasi');
    const deadlineRadios = document.querySelectorAll('input[name="deadline"]');

    // Receipt Elements
    const rDate = document.getElementById('r-date');
    const rPaketName = document.getElementById('r-paket-name');
    const rPaketTotal = document.getElementById('r-paket-total');
    const rDurasiVal = document.getElementById('r-durasi-val');
    const rPaketBase = document.getElementById('r-paket-base');
    const rDeadlineRow = document.getElementById('r-deadline-row');
    const rDeadlineName = document.getElementById('r-deadline-name');
    const rDeadlineTotal = document.getElementById('r-deadline-total');
    const rAddonsContainer = document.getElementById('r-addons-container');
    const rGrandTotal = document.getElementById('r-grand-total');
    const rDpTotal = document.getElementById('r-dp-total');

    // Add-on checkboxes and custom char qty
    const addons = [
        document.getElementById('ao-audio-customer'),
        document.getElementById('ao-vo-ai'),
        document.getElementById('ao-vo-manual'),
        document.getElementById('ao-sub'),
        document.getElementById('ao-sfx'),
        document.getElementById('ao-private'),
        document.getElementById('ao-custom-char')
    ];
    const customCharQty = document.getElementById('ao-char-qty');

    // Format currency
    const formatRp = (num) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    // Set today Date
    const today = new Date();
    rDate.textContent = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    function calculate() {
        // Inputs
        const durasi = parseInt(durasiInput.value) || 1;
        const paketPrice = parseInt(paketSelect.value);
        const paketName = paketSelect.options[paketSelect.selectedIndex].getAttribute('data-name');

        let deadlinePricePerMin = 0;
        let deadlineName = "";
        deadlineRadios.forEach(r => {
            if (r.checked) {
                deadlinePricePerMin = parseInt(r.value);
                deadlineName = r.getAttribute('data-name');
            }
        });

        let totalHarga = 0;

        // Base package
        const baseCost = paketPrice * durasi;
        totalHarga += baseCost;

        // Update receipt package
        rPaketName.textContent = paketName;
        rPaketBase.textContent = formatRp(paketPrice);
        rDurasiVal.textContent = durasi;
        rPaketTotal.textContent = "Rp " + formatRp(baseCost);

        // Deadline
        const deadlineTotalCost = deadlinePricePerMin * durasi;
        if (deadlineTotalCost > 0) {
            rDeadlineRow.style.display = 'flex';
            rDeadlineName.textContent = deadlineName;
            rDeadlineTotal.textContent = "+Rp " + formatRp(deadlineTotalCost);
            totalHarga += deadlineTotalCost;
        } else {
            rDeadlineRow.style.display = 'none';
        }

        // Add-ons
        rAddonsContainer.innerHTML = '';
        let hasActiveAddons = false;

        addons.forEach(ao => {
            if (ao && ao.checked) {
                if (!hasActiveAddons) {
                    rAddonsContainer.innerHTML = `<div class="item-row main" style="margin-top:10px;"><span>Add-ons:</span></div>`;
                    hasActiveAddons = true;
                }

                const price = parseInt(ao.value);
                const type = ao.getAttribute('data-type');
                let aoName = ao.getAttribute('data-name');
                let aoCost = 0;

                if (type === 'flat') {
                    aoCost = price; // could be 0 for free items
                } else if (type === 'per-minute') {
                    aoCost = price * durasi;
                    aoName += ` (${durasi} mnt x Rp ${formatRp(price)})`;
                } else if (type === 'qty') {
                    const qty = parseInt(customCharQty.value) || 1;
                    aoCost = price * qty;
                    aoName += ` (${qty} karakter x Rp ${formatRp(price)})`;
                }

                totalHarga += aoCost;

                rAddonsContainer.innerHTML += `
                    <div class="item-row sub">
                        <span>- ${aoName}</span>
                        <span>+Rp ${formatRp(aoCost)}</span>
                    </div>
                `;
            }
        });

        // Totals
        rGrandTotal.textContent = "Rp " + formatRp(totalHarga);

        // DP 50%
        const dpVal = totalHarga * 0.5;
        rDpTotal.textContent = "Rp " + formatRp(dpVal);

        return {
            paketName,
            durasi,
            deadlineName,
            totalHarga,
            dpVal
        };
    }

    // Event Listeners for Live Update
    form.addEventListener('input', calculate);

    // Initial Calc
    let currentCalc = calculate();

    // Export Logic
    const btnWa = document.getElementById('btn-whatsapp');

    btnWa.addEventListener('click', () => {
        const waNumber = "6282214816134";
        window.open(`https://wa.me/${waNumber}`, '_blank');
    });

});
