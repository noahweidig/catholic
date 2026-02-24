document.addEventListener('DOMContentLoaded', function () {
    function setupMenubar() {
        var header = document.querySelector('header');
        var nav = header ? header.querySelector('nav') : null;
        if (!header || !nav) return;

        var siteTitle = header.querySelector('.site-title');
        var activeLink = nav.querySelector('a.active');
        var activeHref = activeLink ? activeLink.getAttribute('href') : '';

        var menuGroups = [
            {
                label: 'Home',
                icon: 'fa-solid fa-house',
                href: 'index.html'
            },
            {
                label: 'Faith',
                icon: 'fa-solid fa-cross',
                links: [
                    { label: 'Beliefs', href: 'beliefs.html', icon: 'fa-solid fa-book-bible' },
                    { label: 'Sacraments', href: 'sacraments.html', icon: 'fa-solid fa-water' },
                    { label: 'Prayer', href: 'prayer.html', icon: 'fa-solid fa-hands-praying' }
                ]
            },
            {
                label: 'Church',
                icon: 'fa-solid fa-church',
                links: [
                    { label: 'History', href: 'history.html', icon: 'fa-solid fa-scroll' },
                    { label: 'Structure', href: 'structure.html', icon: 'fa-solid fa-building-columns' },
                    { label: 'Apologetics', href: 'apologetics.html', icon: 'fa-solid fa-shield-halved' }
                ]
            },
            {
                label: 'Resources',
                icon: 'fa-solid fa-bookmark',
                links: [
                    { label: 'Today', href: 'today.html', icon: 'fa-solid fa-calendar-day' },
                    { label: 'Resources', href: 'resources.html', icon: 'fa-solid fa-book-open' }
                ]
            }
        ];

        var navList = document.createElement('ul');
        navList.className = 'menu-root';

        menuGroups.forEach(function (group) {
            var item = document.createElement('li');

            if (group.links) {
                item.className = 'menu-dropdown';

                var button = document.createElement('button');
                button.className = 'menu-trigger';
                button.type = 'button';
                button.setAttribute('aria-expanded', 'false');
                button.innerHTML = '<i class="' + group.icon + '"></i>' + group.label + ' <i class="fa-solid fa-chevron-down"></i>';

                var subMenu = document.createElement('ul');
                subMenu.className = 'submenu';

                var containsActive = false;
                group.links.forEach(function (linkObj) {
                    var subItem = document.createElement('li');
                    var link = document.createElement('a');
                    link.href = linkObj.href;
                    link.innerHTML = '<i class="' + linkObj.icon + '"></i>' + linkObj.label;
                    if (activeHref === linkObj.href) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                        containsActive = true;
                    }
                    subItem.appendChild(link);
                    subMenu.appendChild(subItem);
                });

                if (containsActive) {
                    button.classList.add('active');
                }

                button.addEventListener('click', function () {
                    var isOpen = item.classList.toggle('open');
                    button.setAttribute('aria-expanded', String(isOpen));
                });

                item.appendChild(button);
                item.appendChild(subMenu);
            } else {
                var topLink = document.createElement('a');
                topLink.href = group.href;
                topLink.innerHTML = '<i class="' + group.icon + '"></i>' + group.label;
                if (activeHref === group.href) {
                    topLink.classList.add('active');
                    topLink.setAttribute('aria-current', 'page');
                }
                item.appendChild(topLink);
            }

            navList.appendChild(item);
        });

        nav.innerHTML = '';
        nav.appendChild(navList);

        var utilities = document.createElement('div');
        utilities.className = 'menu-utilities';
        utilities.innerHTML = [
            '<button type="button" class="icon-btn nav-search" aria-label="Search the site"><i class="fa-solid fa-magnifying-glass"></i></button>',
            '<button type="button" class="icon-btn theme-toggle" aria-label="Toggle dark mode" aria-pressed="false"><i class="fa-solid fa-moon"></i></button>'
        ].join('');
        header.appendChild(utilities);

        if (siteTitle) {
            siteTitle.innerHTML = '<a href="index.html" class="brand-link"><img src="images/favicon.svg" alt="Catholic logo" class="brand-logo">Catholic</a>';
            siteTitle.setAttribute('aria-label', 'Catholic home');
        }

        var searchButton = header.querySelector('.nav-search');
        var themeButton = header.querySelector('.theme-toggle');
        var searchTargets = [
            { label: 'Home', href: 'index.html' },
            { label: 'Today', href: 'today.html' },
            { label: 'Beliefs', href: 'beliefs.html' },
            { label: 'Sacraments', href: 'sacraments.html' },
            { label: 'Prayer', href: 'prayer.html' },
            { label: 'History', href: 'history.html' },
            { label: 'Structure', href: 'structure.html' },
            { label: 'Apologetics', href: 'apologetics.html' },
            { label: 'Resources', href: 'resources.html' }
        ];

        if (searchButton) {
            searchButton.addEventListener('click', function () {
                var query = window.prompt('Search for a page (e.g., Prayer, Sacraments, Today):');
                if (!query) return;
                var normalizedQuery = query.trim().toLowerCase();
                var match = searchTargets.find(function (target) {
                    return target.label.toLowerCase().indexOf(normalizedQuery) !== -1;
                });
                if (match) {
                    window.location.href = match.href;
                } else {
                    window.alert('No matching page found. Try: Home, Today, Beliefs, Sacraments, Prayer, History, Structure, Apologetics, Resources.');
                }
            });
        }

        var savedTheme = window.localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('theme-dark');
        }

        function updateThemeButton() {
            if (!themeButton) return;
            var isDark = document.body.classList.contains('theme-dark');
            var icon = themeButton.querySelector('i');
            themeButton.setAttribute('aria-pressed', String(isDark));
            themeButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
            if (icon) {
                icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            }
        }

        updateThemeButton();

        if (themeButton) {
            themeButton.addEventListener('click', function () {
                document.body.classList.toggle('theme-dark');
                var isDark = document.body.classList.contains('theme-dark');
                window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
                updateThemeButton();
            });
        }

        document.addEventListener('click', function (event) {
            var openMenus = nav.querySelectorAll('.menu-dropdown.open');
            openMenus.forEach(function (menu) {
                if (!menu.contains(event.target)) {
                    menu.classList.remove('open');
                    var trigger = menu.querySelector('.menu-trigger');
                    if (trigger) {
                        trigger.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });
    }

    setupMenubar();

    // Scroll reveal animation using Intersection Observer
    var revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: reveal all elements immediately
        revealElements.forEach(function (el) {
            el.classList.add('revealed');
        });
    }

    // Header shrink on scroll (throttled with rAF)
    var header = document.querySelector('header');
    if (header) {
        var ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    // Optimized: Use hysteresis (80px vs 15px) instead of timeout blocking
                    var scrollY = window.scrollY;
                    var isScrolled = header.classList.contains('scrolled');

                    if (scrollY > 80 && !isScrolled) {
                        header.classList.add('scrolled');
                    } else if (scrollY < 15 && isScrolled) {
                        header.classList.remove('scrolled');
                    }

                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // Hamburger menu toggle
    var hamburger = document.querySelector('.hamburger');
    var nav = document.querySelector('header nav');
    if (hamburger && nav) {
        hamburger.addEventListener('click', function () {
            var isOpen = nav.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', String(isOpen));
            var icon = hamburger.querySelector('i');
            if (icon) {
                icon.className = isOpen
                    ? 'fa-solid fa-xmark'
                    : 'fa-solid fa-bars';
            }
        });

        // Close mobile nav on outside click
        document.addEventListener('click', function (event) {
            if (nav.classList.contains('open') &&
                !nav.contains(event.target) &&
                !hamburger.contains(event.target)) {
                nav.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                var icon = hamburger.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // Calendar copy functionality (Event Delegation)
    document.addEventListener('click', function(e) {
        var btn = e.target.closest('.copy-btn');
        if (!btn) return;

        var inputId = btn.getAttribute('data-input-id');
        var messageId = btn.getAttribute('data-message-id');

        if (inputId && messageId) {
            var copyText = document.getElementById(inputId);
            if (copyText) {
                // Success handler
                var showSuccess = function() {
                    var msg = document.getElementById(messageId);
                    if (msg) {
                        msg.style.display = "block";
                        setTimeout(function() {
                            msg.style.display = "none";
                        }, 3000);
                    }
                };

                var fallbackCopy = function() {
                    try {
                        copyText.select();
                        copyText.setSelectionRange(0, 99999); // For mobile devices
                        document.execCommand('copy');
                        showSuccess();

                        // Restore focus to button and clear selection
                        if (window.getSelection) {
                            window.getSelection().removeAllRanges();
                        }
                        btn.focus();
                    } catch (err) {
                        console.error('Fallback: Oops, unable to copy', err);
                    }
                };

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(copyText.value)
                        .then(showSuccess)
                        .catch(function(err) {
                            console.error('Clipboard API failed', err);
                            fallbackCopy();
                        });
                } else {
                    fallbackCopy();
                }
            }
        }
    });

    // Back to Top Button
    var backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);

    var backToTopTicking = false;
    window.addEventListener('scroll', function() {
        if (!backToTopTicking) {
            window.requestAnimationFrame(function() {
                if (window.scrollY > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
                backToTopTicking = false;
            });
            backToTopTicking = true;
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        backToTopBtn.blur();
    });
});
