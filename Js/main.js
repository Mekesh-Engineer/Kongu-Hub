document.addEventListener('DOMContentLoaded', () => {
    // =============================================================================
    // 1. SMART THEME ENGINE (IST Auto-Switch + Manual Override)
    // =============================================================================

    const themeToggleBtns = [
        document.getElementById('theme-toggle'),
        document.getElementById('theme-toggle-mobile')
    ];
    const html = document.documentElement;
    const themeKey = 'kec-digital-hub-theme'; // Unique key for local storage

    // Helper: Disable transitions temporarily to prevent "flashing" during theme switch
    const disableTransitions = () => {
        const style = document.createElement('style');
        style.id = 'disable-transitions';
        style.textContent = '* { transition: none !important; }';
        document.head.appendChild(style);
        setTimeout(() => document.getElementById('disable-transitions')?.remove(), 50);
    };

    // Helper: Get Current Hour in Indian Standard Time (IST)
    const getISTHours = () => {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const istOffset = 5.5 * 60 * 60 * 1000; // +5:30
        return new Date(utc + istOffset).getHours();
    };

    // Helper: Update Button Icons & Aria Labels
    const updateIcons = (isDark) => {
        themeToggleBtns.forEach(btn => {
            if (btn) {
                const icon = btn.querySelector('.material-icons');
                if (icon) icon.textContent = isDark ? 'light_mode' : 'dark_mode';
                btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
            }
        });
    };

    // Core: Apply Theme
    const applyTheme = (isDark, enableTransition = true) => {
        if (!enableTransition) disableTransitions();

        if (isDark) {
            html.classList.add('dark');
            html.classList.remove('light');
        } else {
            html.classList.add('light');
            html.classList.remove('dark');
        }
        updateIcons(isDark);
    };

    // Init: Check Storage or Use IST
    const initTheme = () => {
        const savedTheme = localStorage.getItem(themeKey);

        if (savedTheme) {
            applyTheme(savedTheme === 'dark', false);
        } else {
            const hour = getISTHours();
            // Dark mode logic: 7 PM (19) to 6 AM (6)
            const isNight = hour >= 19 || hour < 6;
            applyTheme(isNight, false);
        }
    };

    // Event Listeners: Toggle Buttons
    themeToggleBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                const isDark = !html.classList.contains('dark');
                applyTheme(isDark, true);
                localStorage.setItem(themeKey, isDark ? 'dark' : 'light');
            });
        }
    });

    initTheme();

    // =============================================================================
    // 2. MOBILE MENU LOGIC
    // =============================================================================

    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            const icon = menuBtn.querySelector('.material-icons');
            if (icon) icon.textContent = isHidden ? 'menu' : 'close';

            // Optional: Close menu when a link is clicked
            if (!isHidden) {
                mobileMenu.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        mobileMenu.classList.add('hidden');
                        icon.textContent = 'menu';
                    }, { once: true });
                });
            }
        });
    }

    // =============================================================================
    // 3. NAVBAR SCROLL EFFECT
    // =============================================================================

    const navbar = document.getElementById('navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('shadow-md', 'py-2', 'bg-bg-glass');
                navbar.classList.remove('py-3');
            } else {
                navbar.classList.remove('shadow-md', 'py-2');
                navbar.classList.add('py-3');
            }
        });
    }

    // =============================================================================
    // 4. SCROLL ANIMATIONS (Intersection Observer)
    // =============================================================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-8'); // Remove initial states
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target elements with specific class or just reuse existing classes
    document.querySelectorAll('.animate-fade-in-up').forEach((el) => {
        // Ensure they start hidden if not already managed by CSS
        if (!el.classList.contains('opacity-0')) {
            el.classList.add('opacity-0');
        }
        observer.observe(el);
    });

    // =============================================================================
    // 5. LANDING MODAL LOGIC
    // =============================================================================

    const modal = document.getElementById("landingModal");
    const openBtn = document.getElementById("openDetailsBtn");

    // Initialize modal animation state
    if (modal) {
        // Force opacity 1 after a slight delay for the entrance animation to resolve
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.classList.add('opacity-100');
        }, 100);
    }

    if (modal && openBtn) {
        openBtn.addEventListener("click", () => {
            // 1. Start fade out animation
            modal.style.transition = "opacity 0.5s ease, transform 0.5s ease";
            modal.classList.remove('opacity-100');
            modal.classList.add('opacity-0', 'pointer-events-none');

            // Scale down inner card
            const modalInner = modal.querySelector('div');
            if (modalInner) modalInner.classList.add('scale-95');

            // 2. Remove from DOM layout after animation
            setTimeout(() => {
                modal.classList.add("hidden");
                // Smooth scroll to the main content (Quick Links)
                const targetSection = document.getElementById('links');
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 500);
        });
    }
});