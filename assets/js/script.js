document.addEventListener('DOMContentLoaded', function () {
    // === 1. Funcionalidades existentes (GLightbox, portfolio, calculadora) ===
    
    // GLightbox
    if (typeof GLightbox !== 'undefined') {
        GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true,
            zoomable: true,
            draggable: true
        });
    }

    // Filtro de portfolio
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (portfolioGrid) {
        function filterPortfolio() {
            const categoryBtn = document.querySelector('.portfolio-filters > div:first-child .filter-btn.active');
            const levelBtn = document.querySelector('.portfolio-filters > div:last-child .filter-btn.active');
            const category = categoryBtn ? categoryBtn.dataset.filter : 'all';
            const level = levelBtn ? levelBtn.dataset.filter : 'all';
            
            document.querySelectorAll('.portfolio-item').forEach(item => {
                const matchCat = category === 'all' || item.dataset.category === category;
                const matchLvl = level === 'all' || item.dataset.level === level;
                item.style.display = (matchCat && matchLvl) ? 'block' : 'none';
            });
        }

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const parentDiv = this.closest('div');
                const group = parentDiv === document.querySelector('.portfolio-filters > div:first-child')
                    ? document.querySelectorAll('.portfolio-filters > div:first-child .filter-btn')
                    : document.querySelectorAll('.portfolio-filters > div:last-child .filter-btn');
                
                group.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                filterPortfolio();
            });
        });
    }

    // Calculadora de precios
    const calcElements = document.getElementById('miniatureType');
    if (calcElements) {
        const priceConfig = {
            pequeña: { basico: 5, estandar: 7, premium: 10, competicion: 20 },
            infanteria: { basico: 8, estandar: 10, premium: 25, competicion: 40 },
            caballeria: { basico: 12, estandar: 16, premium: 30, competicion: 45 },
            grande: { basico: 25, estandar: 50, premium: 80, competicion: 100 },
            escenografia: { basico: 20, estandar: 35, premium: 55, competicion: 85 }
        };

        function calculatePrice() {
            const type = document.getElementById('miniatureType').value;
            const level = document.getElementById('paintLevel').value;
            let qty = parseInt(document.getElementById('quantity').value) || 1;
            qty = Math.max(1, Math.min(100, qty));

            const unitPrice = priceConfig[type]?.[level];
            if (unitPrice == null) {
                document.getElementById('totalPrice').textContent = '€0.00';
                return;
            }

            const total = unitPrice * qty;
            document.getElementById('totalPrice').textContent = `€${total.toFixed(2)}`;
        }

        ['miniatureType', 'paintLevel'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', calculatePrice);
        });

        const qtyInput = document.getElementById('quantity');
        if (qtyInput) {
            qtyInput.addEventListener('input', calculatePrice);
            qtyInput.addEventListener('blur', () => {
                qtyInput.value = Math.max(1, Math.min(100, parseInt(qtyInput.value) || 1));
                calculatePrice();
            });
        }

        calculatePrice();
    }

    // === 2. ✅ TOGGLE DE MODO (versión segura) ===
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return; // si no hay botón, salimos

    // Leer preferencia: por defecto 'dark'
    const userPref = localStorage.getItem('color-theme') || 'dark';
    if (userPref === 'light') {
        document.body.classList.add('light-mode');
    }

    // Actualizar icono
    function updateIcon() {
        const icon = toggle.querySelector('i');
        if (!icon) return;
        icon.className = document.body.classList.contains('light-mode')
            ? 'bi bi-moon-stars-fill'
            : 'bi bi-brightness-high-fill';
    }
    updateIcon();

    // Cambiar tema
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('color-theme', isLight ? 'light' : 'dark');
        updateIcon();
    });

    // === Efecto navbar al hacer scroll ===
const navbar = document.querySelector('.navbar');
if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll <= 0) {
            navbar.classList.remove('scrolled');
            return;
        }

        // Agregar clase 'scrolled' al bajar, quitar al subir mucho
        if (currentScroll > lastScroll && currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else if (currentScroll < lastScroll || currentScroll <= 80) {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}
// === Ajustar el espacio para la navbar en todos los tamaños ===
function adjustContentPadding() {
    const navbar = document.querySelector('.navbar');
    const mainContent = document.getElementById('main-content');
    
    if (navbar && mainContent) {
        const navbarHeight = navbar.offsetHeight;
        mainContent.style.paddingTop = navbarHeight + 'px';
    }
}

// Ejecutar al cargar y al redimensionar
adjustContentPadding();
window.addEventListener('resize', adjustContentPadding);

// === Fade-in al cargar ===
document.documentElement.classList.add('loaded');

});