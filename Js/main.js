// --- 1. Smart Theme Engine (IST Auto-Switch + Manual Override) ---
const themeToggleBtns = [document.getElementById('theme-toggle'), document.getElementById('theme-toggle-mobile')];
const html = document.documentElement;

// Disable transitions during initial theme load to prevent flash
function disableTransitions() {
    const style = document.createElement('style');
    style.id = 'disable-transitions';
    style.textContent = '* { transition: none !important; }';
    document.head.appendChild(style);

    // Re-enable after a brief moment
    setTimeout(() => {
        document.getElementById('disable-transitions')?.remove();
    }, 50);
}

function getISTHours() {
    // Get current time in UTC
    const now = new Date();
    // IST is UTC + 5:30
    // Calculate IST time by adding offset (5.5 hours * 60 min * 60 sec * 1000 ms)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + istOffset);
    return istTime.getHours();
}

function updateIcons(isDark) {
    themeToggleBtns.forEach(btn => {
        if (btn) {
            const icon = btn.querySelector('.material-icons');
            if (icon) {
                icon.textContent = isDark ? 'light_mode' : 'dark_mode';
            }
            btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        }
    });
}

function applyTheme(isDark, enableTransition = true) {
    if (!enableTransition) {
        disableTransitions();
    }

    if (isDark) {
        html.classList.add('dark');
        html.classList.remove('light');
    } else {
        html.classList.add('light');
        html.classList.remove('dark');
    }

    updateIcons(isDark);
}

function initTheme() {
    // 1. Check if user has manually set a preference
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        const isDark = savedTheme === 'dark';
        applyTheme(isDark, false); // No transition on initial load
        console.log(`Theme: Applied saved preference (${savedTheme})`);
    } else {
        // 2. If no manual preference, use IST Auto-Timer
        const currentHour = getISTHours();
        // Dark mode between 7 PM (19:00) and 6 AM (06:00)
        const isNightTime = currentHour >= 19 || currentHour < 6;

        applyTheme(isNightTime, false); // No transition on initial load
        console.log(`Auto-Theme: ${isNightTime ? 'Dark' : 'Light'} Mode (IST Hour: ${currentHour})`);
    }
}

// Initialize on load
initTheme();

// Event Listener for Manual Toggle
themeToggleBtns.forEach(btn => {
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const isDark = !html.classList.contains('dark');
            applyTheme(isDark, true); // Enable smooth transition

            // Save manual preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            console.log(`Theme: Manually switched to ${isDark ? 'dark' : 'light'} mode`);
            console.log(`HTML classes: ${html.className}`);
            console.log(`Background color: ${getComputedStyle(document.body).backgroundColor}`);
        });
    }
});

// Debug: Log current theme on page load
console.log(`Initial theme: ${html.classList.contains('dark') ? 'dark' : 'light'}`);
console.log(`HTML classes: ${html.className}`);
console.log(`LocalStorage theme: ${localStorage.getItem('theme')}`);

// --- 2. Mobile Menu Logic ---
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = menuBtn.querySelector('.material-icons');
    icon.textContent = mobileMenu.classList.contains('hidden') ? 'menu' : 'close';
});

// --- 3. Scroll Navbar Effect ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('shadow-md');
        navbar.classList.add('py-2');
        navbar.classList.remove('py-3');
    } else {
        navbar.classList.remove('shadow-md');
        navbar.classList.add('py-3');
        navbar.classList.remove('py-2');
    }
});

// --- 4. Intersection Observer for Scroll Animations ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.classList.remove('opacity-0');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-fade-in-up').forEach((el) => observer.observe(el));