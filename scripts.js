// ===== STYLE =====
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea-600 dark:focus-visible:outline-aqua-200";

const LINK_CLASSES = "flex min-h-12 items-center gap-3 rounded-xl bg-white px-4 py-3 font-medium shadow-sm ring-1 ring-aqua-200 transition duration-200 hover:-translate-y-0.5 hover:ring-sea-600 dark:bg-ink-900 dark:ring-ink-800 dark:hover:ring-aqua-200 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ";

const TAB_CLASSES = "flex-none rounded-full bg-white px-4 py-1.5 text-sm font-medium text-ink-950 ring-1 ring-aqua-200 aria-pressed:bg-sea-600 aria-pressed:text-white aria-pressed:ring-sea-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea-600 dark:bg-ink-900 dark:text-mist-100 dark:ring-ink-800 dark:focus-visible:outline-aqua-200 dark:aria-pressed:bg-aqua-200 dark:aria-pressed:text-ink-950 dark:aria-pressed:ring-aqua-200";

const BUTTON_CLASSES = "inline-flex min-h-12 items-center justify-center rounded-xl bg-sea-600 px-5 font-semibold text-white hover:bg-sea-700 dark:bg-aqua-200 dark:text-ink-950 dark:hover:bg-aqua-200/90 ";

const GHOST_BUTTON_CLASSES = "inline-flex min-h-12 items-center justify-center rounded-xl px-5 font-semibold ring-1 ring-aqua-200 hover:bg-mist-100 dark:ring-ink-800 dark:hover:bg-ink-800 ";

const ICON_BUTTON_CLASSES = "flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-aqua-200 hover:bg-mist-100 dark:ring-ink-800 dark:hover:bg-ink-800 ";

const MUTED = "text-ink-500 dark:text-ink-300";

const ICONS = {
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>',
    whatsapp: '<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.5 10.5h7M8.5 14h4.5"/>',
    grab: '<path d="M3 7.5l9-4.5 9 4.5v9l-9 4.5-9-4.5v-9z"/><path d="M3 7.5l9 4.5 9-4.5M12 12v9"/>',
    maps: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>'
};

function Icon(name) {
    return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.web}</svg>`;
}

// ===== STATE =====
const CART_KEY = "umkm:cart";

const state = {
    products: TOKO.products,
    activeCategory: "semua",
    cart: loadCart(),
    theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
    copied: false
};

function setState(changes) {
    Object.assign(state, changes);
    if ("cart" in changes) {
        saveCart(state.cart);
    }
    render();
}

// ===== HELPER =====
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatRupiah(amount) {
    return "Rp" + amount.toLocaleString("id-ID");
}

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function toMinutes(hhmm) {
    const parts = hhmm.split(":");
    return Number(parts[0]) * 60 + Number(parts[1]);
}

function getStoreStatus(hours, now) {
    const day = now.getDay();
    const minutesNow = now.getHours() * 60 + now.getMinutes();
    const today = hours[day];

    if (today && minutesNow >= toMinutes(today[0]) && minutesNow < toMinutes(today[1])) {
        return { open: true, text: "Buka, tutup " + today[1] };
    }
    if (today && minutesNow < toMinutes(today[0])) {
        return { open: false, text: "Tutup, buka hari ini " + today[0] };
    }
    for (let i = 1; i <= 7; i++) {
        const nextDay = (day + i) % 7;
        if (hours[nextDay]) {
            const when = i === 1 ? "besok" : DAY_NAMES[nextDay];
            return { open: false, text: "Tutup, buka " + when + " " + hours[nextDay][0] };
        }
    }
    return { open: false, text: "Tutup" };
}

function loadCart() {
    const cart = {};
    try {
        const saved = JSON.parse(localStorage.getItem(CART_KEY)) || {};
        TOKO.products.forEach(function (product) {
            const qty = saved[product.id];
            if (!product.soldOut && Number.isInteger(qty) && qty > 0) {
                cart[product.id] = qty;
            }
        });
    } catch (error) {
    }
    return cart;
}

function saveCart(cart) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
    }
}

// behaviour
function getVisibleProducts(state) {
    if (state.activeCategory === "semua") {
        return state.products;
    }
    return state.products.filter(function (product) {
        return product.category === state.activeCategory;
    });
}

function getCartLines(state) {
    return state.products
        .filter(function (product) {
            return state.cart[product.id] > 0;
        })
        .map(function (product) {
            const qty = state.cart[product.id];
            return { product: product, qty: qty, subtotal: product.price * qty };
        });
}

function getCartTotals(state) {
    const lines = getCartLines(state);
    return {
        count: lines.reduce(function (sum, line) { return sum + line.qty; }, 0),
        total: lines.reduce(function (sum, line) { return sum + line.subtotal; }, 0)
    };
}

function changeQty(id, delta) {
    const newQty = (state.cart[id] || 0) + delta;
    const newCart = Object.assign({}, state.cart);
    if (newQty <= 0) {
        delete newCart[id];
    } else {
        newCart[id] = newQty;
    }
    setState({ cart: newCart });
}

function buildWhatsAppUrl(state) {
    const lines = getCartLines(state);
    const text =
        "Halo " + TOKO.name + ", saya mau pesan:\n" +
        lines.map(function (line) {
            return "- " + line.qty + "x " + line.product.name + " (" + formatRupiah(line.subtotal) + ")";
        }).join("\n") +
        "\nTotal: " + formatRupiah(getCartTotals(state).total);
    return "https://wa.me/" + TOKO.whatsapp + "?text=" + encodeURIComponent(text);
}

// ===== KOMPONEN =====
function StoreHeader() {
    const logo = TOKO.logo
        ? `<img src="${escapeHtml(TOKO.logo)}" alt="" width="96" height="96" class="h-full w-full object-cover">`
        : escapeHtml(TOKO.name.trim().charAt(0).toUpperCase());

    return `
        <div class="flex flex-col items-center text-center">
            <div class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-sea-600 font-display text-4xl text-white shadow ring-4 ring-white dark:bg-aqua-200 dark:text-ink-950 dark:ring-ink-800 md:h-28 md:w-28" aria-hidden="true">${logo}</div>
            <h1 class="mt-4 font-display text-3xl font-bold">${escapeHtml(TOKO.name)}</h1>
            <p class="mt-1 text-sm ${MUTED}">${escapeHtml(TOKO.tagline)}</p>
            <div id="store-status" aria-live="polite"></div>
        </div>`;
}

function StatusBadge(status) {
    const dot = status.open ? "bg-green-600" : "bg-red-600";
    return `
        <span class="mt-3 inline-flex items-center gap-2 rounded-full bg-aqua-200 px-4 py-1.5 text-sm font-semibold dark:bg-ink-800">
            <span class="h-2 w-2 rounded-full ${dot}" aria-hidden="true"></span>${escapeHtml(status.text)}
        </span>`;
}

function StoreLink(link) {
    const external = link.url.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `
        <li>
            <a href="${escapeHtml(link.url)}"${external} class="${LINK_CLASSES}">
                <span class="text-sea-700 dark:text-aqua-200">${Icon(link.icon)}</span>
                ${escapeHtml(link.title)}
            </a>
        </li>`;
}

function StoreLinks() {
    return `<ul class="space-y-3">${TOKO.links.map(StoreLink).join("")}</ul>`;
}

function StoreHours() {
    const today = new Date().getDay();
    const rows = [1, 2, 3, 4, 5, 6, 0].map(function (day) {
        const range = TOKO.hours[day] ? TOKO.hours[day][0] + " - " + TOKO.hours[day][1] : "Tutup";
        const highlight = day === today ? "font-bold text-sea-700 dark:text-aqua-200" : "";
        return `<li class="flex justify-between border-b border-dashed border-aqua-200 py-1.5 dark:border-ink-800 ${highlight}"><span>${DAY_NAMES[day]}</span><span>${range}</span></li>`;
    }).join("");

    return `
        <h2 id="hours-heading" class="text-sm font-semibold uppercase tracking-wide ${MUTED}">Jam &amp; lokasi</h2>
        <p class="mt-3 text-sm">${escapeHtml(TOKO.address)}</p>
        <ul class="mt-3 text-sm">${rows}</ul>
        <button type="button" data-action="open-payment" class="${GHOST_BUTTON_CLASSES} mt-4 w-full">Info pembayaran</button>`;
}

function FilterTabs(state) {
    return TOKO.categories.map(function (category) {
        const isActive = category.id === state.activeCategory;
        return `
        <button type="button" data-action="filter" data-id="${escapeHtml(category.id)}"
            aria-pressed="${isActive}" class="${TAB_CLASSES}">${escapeHtml(category.label)}</button>`;
    }).join("");
}

function QtyControl(product, qty) {
    if (product.soldOut) {
        return `<button type="button" disabled class="${GHOST_BUTTON_CLASSES} w-full opacity-50">Habis</button>`;
    }
    if (qty === 0) {
        return `<button type="button" data-action="add" data-id="${escapeHtml(product.id)}"
            class="${GHOST_BUTTON_CLASSES} w-full text-sea-700 ring-sea-600 dark:text-aqua-200 dark:ring-aqua-200">Tambah</button>`;
    }
    const small = "flex h-11 w-11 items-center justify-center rounded-xl bg-sea-600 text-xl font-bold text-white dark:bg-aqua-200 dark:text-ink-950 " + FOCUS;
    return `
        <div class="flex items-center justify-between gap-2">
            <button type="button" data-action="dec" data-id="${escapeHtml(product.id)}" aria-label="Kurangi ${escapeHtml(product.name)}" class="${small}">&minus;</button>
            <span class="font-bold" aria-live="polite">${qty}</span>
            <button type="button" data-action="inc" data-id="${escapeHtml(product.id)}" aria-label="Tambah ${escapeHtml(product.name)}" class="${small}">+</button>
        </div>`;
}

function ProductCard(product, qty) {
    const photo = product.photo
        ? `<img src="${escapeHtml(product.photo)}" alt="${escapeHtml(product.name)}" width="400" height="300" loading="lazy" class="h-full w-full object-cover">`
        : `<span class="font-display text-4xl text-sea-700 dark:text-aqua-200" aria-hidden="true">${escapeHtml(product.name.charAt(0))}</span>`;
    const badge = product.soldOut
        ? '<span class="absolute left-2 top-2 rounded-full bg-ink-950 px-3 py-0.5 text-xs font-semibold text-mist-100">Habis</span>'
        : "";

    return `
        <article class="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-aqua-200 dark:bg-ink-900 dark:ring-ink-800">
            <div class="relative flex aspect-[4/3] items-center justify-center bg-aqua-200 dark:bg-ink-800">${photo}${badge}</div>
            <div class="flex flex-1 flex-col gap-1 p-3">
                <h3 class="leading-snug font-semibold">${escapeHtml(product.name)}</h3>
                <p class="font-semibold ${MUTED}">${formatRupiah(product.price)}</p>
                <div class="mt-auto pt-2">${QtyControl(product, qty)}</div>
            </div>
        </article>`;
}

function ProductGrid(state) {
    const visible = getVisibleProducts(state);
    if (visible.length === 0) {
        return `<p class="col-span-full rounded-xl bg-white px-5 py-4 text-center text-sm ${MUTED} ring-1 ring-aqua-200 dark:bg-ink-900 dark:ring-ink-800">Belum ada produk di kategori ini.</p>`;
    }
    return visible.map(function (product) {
        return ProductCard(product, state.cart[product.id] || 0);
    }).join("");
}

function CartBar(state) {
    const totals = getCartTotals(state);
    if (totals.count === 0) {
        return "";
    }
    return `
        <div class="fixed inset-x-0 bottom-0 z-10 bg-gradient-to-t from-mist-100 from-70% to-transparent px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-6 dark:from-ink-950">
            <button type="button" data-action="open-cart" class="${BUTTON_CLASSES} mx-auto flex w-full max-w-md justify-between gap-3 shadow-lg md:max-w-2xl lg:max-w-5xl">
                <span>${totals.count} item</span>
                <span>${formatRupiah(totals.total)}</span>
                <span>Lihat pesanan</span>
            </button>
        </div>`;
}

function DialogHeader(id, title) {
    return `
        <div class="mb-4 flex items-center justify-between">
            <h2 id="${id}" class="font-display text-xl">${title}</h2>
            <button type="button" data-action="close-dialog" aria-label="Tutup" class="${ICON_BUTTON_CLASSES}">${Icon("close")}</button>
        </div>`;
}

function CartContent(state) {
    const lines = getCartLines(state);
    const header = DialogHeader("cart-title", "Pesanan kamu");

    if (lines.length === 0) {
        return header + `<p class="${MUTED}">Belum ada pesanan.</p>`;
    }

    const small = "flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-aqua-200 dark:ring-ink-800 " + FOCUS;
    const rows = lines.map(function (line) {
        const id = escapeHtml(line.product.id);
        const name = escapeHtml(line.product.name);
        return `
            <li class="flex items-center justify-between gap-3 border-b border-dashed border-aqua-200 py-2 dark:border-ink-800">
                <div class="min-w-0 flex-1">
                    <p class="font-medium">${name}</p>
                    <p class="text-sm ${MUTED}">${formatRupiah(line.subtotal)}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button" data-action="dec" data-id="${id}" aria-label="Kurangi ${name}" class="${small}">&minus;</button>
                    <span class="w-6 text-center font-bold">${line.qty}</span>
                    <button type="button" data-action="inc" data-id="${id}" aria-label="Tambah ${name}" class="${small}">+</button>
                </div>
            </li>`;
    }).join("");

    return header + `
        <ul class="max-h-[45vh] overflow-y-auto">${rows}</ul>
        <p class="my-4 flex justify-between text-lg">Total <strong>${formatRupiah(getCartTotals(state).total)}</strong></p>
        <div class="flex flex-wrap gap-2">
            <button type="button" data-action="clear-cart" class="${GHOST_BUTTON_CLASSES} flex-1">Kosongkan</button>
            <a href="${escapeHtml(buildWhatsAppUrl(state))}" target="_blank" rel="noopener noreferrer" class="${BUTTON_CLASSES} flex-[2]">Pesan via WhatsApp</a>
        </div>`;
}

function PaymentContent(state) {
    const payment = TOKO.payment;
    const qris = payment.qris
        ? `<img src="${escapeHtml(payment.qris)}" alt="QRIS ${escapeHtml(TOKO.name)}" width="320" height="320" loading="lazy" class="mx-auto mt-4 max-w-full rounded-xl">`
        : "";
    return DialogHeader("payment-title", "Pembayaran") + `
        <p class="${MUTED}">Transfer ke ${escapeHtml(payment.bank)} a.n. ${escapeHtml(payment.accountName)}</p>
        <div class="mt-3 flex items-center gap-2">
            <code id="account-number" class="flex-1 rounded-lg bg-mist-100 p-3 text-lg dark:bg-ink-800">${escapeHtml(payment.accountNumber)}</code>
            <button type="button" data-action="copy-account" class="${GHOST_BUTTON_CLASSES}">${state.copied ? "Tersalin" : "Salin"}</button>
        </div>
        ${qris}`;
}

// ===== RENDER =====
const storeHeader = document.querySelector("#store-header");
const storeLinks = document.querySelector("#store-links");
const storeHours = document.querySelector("#store-hours");
const filterTabs = document.querySelector("#filter-tabs");
const productGrid = document.querySelector("#product-grid");
const cartBar = document.querySelector("#cart-bar");
const cartDialog = document.querySelector("#cart-dialog");
const cartContent = document.querySelector("#cart-content");
const paymentDialog = document.querySelector("#payment-dialog");
const paymentContent = document.querySelector("#payment-content");
const themeToggle = document.querySelector("#theme-toggle");

function renderTheme() {
    const isDark = state.theme === "dark";
    document.documentElement.classList.toggle("dark", isDark); // true = pasang, false = lepas
    themeToggle.innerHTML = Icon(isDark ? "sun" : "moon");
    themeToggle.setAttribute("aria-label", isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap");
}

function renderStatus() {
    document.querySelector("#store-status").innerHTML = StatusBadge(getStoreStatus(TOKO.hours, new Date()));
}

function render() {
    const active = document.activeElement;
    const focusAction = active && active.dataset ? active.dataset.action : undefined;
    const focusId = active && active.dataset ? active.dataset.id : undefined;

    filterTabs.innerHTML = FilterTabs(state);
    productGrid.innerHTML = ProductGrid(state);
    cartBar.innerHTML = CartBar(state);
    cartContent.innerHTML = CartContent(state);
    paymentContent.innerHTML = PaymentContent(state);
    renderTheme();

    if (focusAction) {
        const selector = focusId
            ? `[data-action="${focusAction}"][data-id="${CSS.escape(focusId)}"]`
            : `[data-action="${focusAction}"]`;
        const replacement = { add: "inc", dec: "add" }[focusAction];
        const again = document.querySelector(selector)
            || (replacement && document.querySelector(`[data-action="${replacement}"][data-id="${CSS.escape(focusId)}"]`));
        if (again) {
            again.focus();
        }
    }
}

// ===== EVENT =====
document.addEventListener("click", function (event) {
    if (event.target === cartDialog || event.target === paymentDialog) {
        event.target.close();
        return;
    }

    const button = event.target.closest("[data-action]");
    if (button === null) {
        return;
    }
    const id = button.dataset.id;

    switch (button.dataset.action) {
        case "filter":
            setState({ activeCategory: id });
            break;
        case "add":
        case "inc":
            changeQty(id, 1);
            break;
        case "dec":
            changeQty(id, -1);
            break;
        case "clear-cart":
            setState({ cart: {} });
            cartDialog.close();
            break;
        case "open-cart":
            cartDialog.showModal();
            break;
        case "open-payment":
            paymentDialog.showModal();
            break;
        case "close-dialog":
            button.closest("dialog").close();
            break;
        case "toggle-theme": {
            const newTheme = state.theme === "dark" ? "light" : "dark";
            try {
                localStorage.setItem("umkm:theme", newTheme);
            } catch (error) {

            }
            setState({ theme: newTheme });
            break;
        }
        case "copy-account":
            copyAccountNumber();
            break;
    }
});

async function copyAccountNumber() {
    try {
        await navigator.clipboard.writeText(TOKO.payment.accountNumber);
    } catch (error) {
        const range = document.createRange();
        range.selectNodeContents(document.querySelector("#account-number"));
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        try { document.execCommand("copy"); } catch (e) {  }
    }
    setState({ copied: true });
    setTimeout(function () {
        setState({ copied: false });
    }, 1500);
}

// ===== MULAI =====
document.title = TOKO.name;
storeHeader.innerHTML = StoreHeader();
storeLinks.innerHTML = StoreLinks();
storeHours.innerHTML = StoreHours();
renderStatus();
render();
setInterval(renderStatus, 60000);
