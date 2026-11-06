// ===== DATA TOKO =====
const TOKO = {
  name: "Kopi Pilgrim",
  tagline: "Kopi dan kue rumahan, dibuat segar setiap hari",
  logo: "assets/icon.svg",
  whatsapp: "6281234567890",
  address: "Jl. Sana Sini",

  hours: {
    0: null,
    1: ["08:00", "21:00"],
    2: ["08:00", "21:00"],
    3: ["08:00", "21:00"],
    4: ["08:00", "21:00"],
    5: ["08:00", "22:00"],
    6: ["09:00", "22:00"]
  },

  links: [
    { id: 1, title: "Instagram", url: "https://instagram.com/", icon: "instagram" },
    { id: 2, title: "WhatsApp", url: "https://wa.me/6281234567890", icon: "whatsapp" },
    { id: 3, title: "Grab", url: "https://grab.com/", icon: "grab" },
    { id: 4, title: "Maps", url: "https://maps.google.com/", icon: "maps" }
  ],

  payment: {
    bank: "BCA",
    accountNumber: "1234567890",
    accountName: "Nama Pemilik",
    qris: null
  },

  categories: [
    { id: "semua", label: "Semua" },
    { id: "kopi", label: "Kopi" },
    { id: "non-kopi", label: "Non-Kopi" },
    { id: "kue", label: "Kue" }
  ],

  products: [
    { id: "kopsu", name: "Kopi Susu Gula Aren", price: 18000, category: "kopi", photo: "assets/kopsu.webp", soldOut: false },
    { id: "americano", name: "Americano", price: 15000, category: "kopi", photo: "assets/americano.webp", soldOut: false },
    { id: "v60", name: "V60 Single Origin", price: 25000, category: "kopi", photo: "assets/v60.webp", soldOut: false },
    { id: "matcha", name: "Matcha Latte", price: 22000, category: "non-kopi", photo: "assets/matcha.webp", soldOut: false },
    { id: "cokelat", name: "Cokelat Panas", price: 20000, category: "non-kopi", photo: "assets/cokelat.webp", soldOut: true },
    { id: "brownies", name: "Brownies Panggang", price: 15000, category: "kue", photo: "assets/brownies.webp", soldOut: false },
    { id: "roti-bakar", name: "Roti Bakar Keju", price: 17000, category: "kue", photo: "assets/rotikeju.webp", soldOut: false },
    { id: "pisang", name: "Pisang Cokelat", price: 12000, category: "kue", photo: null, soldOut: false }
  ]
};
