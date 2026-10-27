/**
 * MBKTech Unified Theme Controller
 * Interoperable with mbktech.org, mbkcore, and mbkutils.
 */
(function () {
    const STORAGE_KEY = 'mbk-theme';

    function getPreferredTheme() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'dark' || stored === 'light') return stored;
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } catch (e) {
            return 'light';
        }
    }

    function applyTheme(theme) {
        const root = document.documentElement;
        const isDark = theme === 'dark';

        if (isDark) {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
        } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
        }

        // Update any toggle buttons in the DOM
        document.querySelectorAll('.theme-toggle').forEach((btn) => {
            const moonIcon = btn.querySelector('.fa-moon, .lni-night');
            const sunIcon = btn.querySelector('.fa-sun, .lni-sun');
            if (moonIcon && sunIcon) {
                if (isDark) {
                    moonIcon.classList.add('hidden');
                    sunIcon.classList.remove('hidden');
                } else {
                    moonIcon.classList.remove('hidden');
                    sunIcon.classList.add('hidden');
                }
            } else {
                const singleIcon = btn.querySelector('i');
                if (singleIcon) {
                    singleIcon.className = isDark ? 'lni lni-sun text-amber-400' : 'lni lni-night';
                }
            }
        });
    }

    // Apply immediately to prevent layout / color flash
    const initialTheme = getPreferredTheme();
    applyTheme(initialTheme);

    window.toggleTheme = function () {
        const root = document.documentElement;
        const isDark = root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark';
        const nextTheme = isDark ? 'light' : 'dark';
        try {
            localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch (e) { /* ignore */ }
        applyTheme(nextTheme);
        return nextTheme;
    };

    document.addEventListener('DOMContentLoaded', () => {
        applyTheme(getPreferredTheme());

        document.querySelectorAll('.theme-toggle').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.toggleTheme();
            });
        });
    });

    // Listen to OS theme changes if user has no explicit preference stored
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            try {
                if (!localStorage.getItem(STORAGE_KEY)) {
                    applyTheme(e.matches ? 'dark' : 'light');
                }
            } catch (err) {}
        });
    }
})();
