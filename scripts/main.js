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
            '<button type="button" class="icon-btn nav-search" aria-label="Search the site" title="Search (\u2318K)"><i class="fa-solid fa-magnifying-glass"></i></button>',
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
            { label: 'Home', href: 'index.html', icon: 'fa-solid fa-house', desc: 'Welcome and introduction to the Catholic faith', keywords: ['home', 'welcome', 'intro', 'start', 'beginning'] },
            { label: "Today's Liturgy", href: 'today.html', icon: 'fa-solid fa-calendar-day', desc: 'Daily Mass readings and feast day', keywords: ['today', 'liturgy', 'daily', 'readings', 'mass', 'feast', 'gospel', 'psalm'] },
            { label: 'Beliefs', href: 'beliefs.html', icon: 'fa-solid fa-book-bible', desc: 'Core beliefs: Trinity, Christ, Scripture, Salvation', keywords: ['beliefs', 'believe', 'faith', 'trinity', 'god', 'jesus', 'christ', 'scripture', 'bible', 'salvation', 'grace', 'eucharist', 'mary', 'sin', 'purgatory', 'saints', 'creed', 'moral', 'commandments'] },
            { label: 'Sacraments', href: 'sacraments.html', icon: 'fa-solid fa-water', desc: 'The seven sacraments instituted by Christ', keywords: ['sacraments', 'baptism', 'confirmation', 'eucharist', 'communion', 'reconciliation', 'confession', 'anointing', 'holy orders', 'matrimony', 'marriage', 'ordination'] },
            { label: 'Prayer', href: 'prayer.html', icon: 'fa-solid fa-hands-praying', desc: 'The Mass, the Rosary, and forms of prayer', keywords: ['prayer', 'pray', 'mass', 'rosary', 'mysteries', 'joyful', 'luminous', 'sorrowful', 'glorious', 'devotion', 'saints', 'adoration', 'petition', 'intercession', 'thanksgiving', 'hail mary', 'our father'] },
            { label: 'History', href: 'history.html', icon: 'fa-solid fa-scroll', desc: 'Two thousand years of Church history', keywords: ['history', 'timeline', 'apostles', 'councils', 'popes', 'reformation', 'tradition', 'ancient', 'medieval', 'modern'] },
            { label: 'Structure', href: 'structure.html', icon: 'fa-solid fa-building-columns', desc: 'How the Church is organized', keywords: ['structure', 'pope', 'bishop', 'priest', 'deacon', 'cardinal', 'diocese', 'parish', 'vatican', 'hierarchy', 'organization', 'clergy', 'laity'] },
            { label: 'Apologetics', href: 'apologetics.html', icon: 'fa-solid fa-shield-halved', desc: 'Defending and explaining the faith', keywords: ['apologetics', 'defend', 'explain', 'questions', 'objections', 'answers', 'protestant', 'scripture', 'authority', 'tradition'] },
            { label: 'Resources', href: 'resources.html', icon: 'fa-solid fa-book-open', desc: 'Further reading, links, and calendars', keywords: ['resources', 'links', 'reading', 'books', 'calendar', 'subscribe', 'catechism', 'learn', 'study'] }
        ];

        // Build search overlay
        var overlay = document.createElement('div');
        overlay.className = 'search-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-label', 'Search the site');
        overlay.innerHTML = [
            '<div class="search-dialog">',
            '  <div class="search-input-wrap">',
            '    <i class="fa-solid fa-magnifying-glass"></i>',
            '    <input type="text" class="search-input" placeholder="Search pages\u2026" autocomplete="off" spellcheck="false" aria-label="Search pages">',
            '    <span class="search-kbd">ESC</span>',
            '  </div>',
            '  <div class="search-results"></div>',
            '  <div class="sr-only" aria-live="polite" id="search-announcer"></div>',
            '  <div class="search-footer">',
            '    <span><kbd>\u2191</kbd> <kbd>\u2193</kbd> navigate</span>',
            '    <span><kbd>\u21B5</kbd> open</span>',
            '    <span><kbd>esc</kbd> close</span>',
            '  </div>',
            '</div>'
        ].join('\n');
        document.body.appendChild(overlay);

        var searchInput = overlay.querySelector('.search-input');
        var searchResults = overlay.querySelector('.search-results');
        var searchAnnouncer = overlay.querySelector('#search-announcer');
        var activeIndex = -1;
        var previousActiveElement = null;

        function openSearch() {
            previousActiveElement = document.activeElement;
            overlay.classList.add('open');
            searchInput.value = '';
            activeIndex = -1;
            renderResults('');
            // Focus after transition
            setTimeout(function() { searchInput.focus(); }, 50);
        }

        function closeSearch() {
            overlay.classList.remove('open');
            searchInput.blur();
            if (previousActiveElement) {
                previousActiveElement.focus();
            }
        }

        function renderResults(query) {
            var q = query.trim().toLowerCase();
            var filtered = searchTargets;

            if (q.length > 0) {
                filtered = searchTargets.filter(function(t) {
                    if (t.label.toLowerCase().indexOf(q) !== -1) return true;
                    if (t.desc.toLowerCase().indexOf(q) !== -1) return true;
                    return t.keywords.some(function(k) { return k.indexOf(q) !== -1; });
                });

                // Sort: exact label match first, then label contains, then rest
                filtered.sort(function(a, b) {
                    var aLabel = a.label.toLowerCase();
                    var bLabel = b.label.toLowerCase();
                    var aExact = aLabel === q;
                    var bExact = bLabel === q;
                    if (aExact && !bExact) return -1;
                    if (!aExact && bExact) return 1;
                    var aStarts = aLabel.indexOf(q) === 0;
                    var bStarts = bLabel.indexOf(q) === 0;
                    if (aStarts && !bStarts) return -1;
                    if (!aStarts && bStarts) return 1;
                    return 0;
                });
            }

            searchResults.innerHTML = ''; // Clear previous results safely

            if (filtered.length === 0) {
                var emptyDiv = document.createElement('div');
                emptyDiv.className = 'search-empty';
                var emptyIcon = document.createElement('i');
                emptyIcon.className = 'fa-solid fa-magnifying-glass';
                emptyDiv.appendChild(emptyIcon);
                emptyDiv.appendChild(document.createTextNode('No results found'));
                searchResults.appendChild(emptyDiv);
                activeIndex = -1;
                if (searchAnnouncer) searchAnnouncer.textContent = 'No results found';
                return;
            }

            if (searchAnnouncer) {
                searchAnnouncer.textContent = filtered.length + (filtered.length === 1 ? ' result found' : ' results found');
            }

            filtered.forEach(function(t, i) {
                var a = document.createElement('a');
                a.href = t.href;
                a.className = 'search-result' + (i === 0 && q.length > 0 ? ' active' : '');
                a.setAttribute('data-index', i);

                a.appendChild(document.createTextNode('\n  '));

                var iconSpan = document.createElement('span');
                iconSpan.className = 'search-result-icon';
                var iconI = document.createElement('i');
                iconI.className = t.icon;
                iconSpan.appendChild(iconI);
                a.appendChild(iconSpan);

                a.appendChild(document.createTextNode('\n  '));

                var textSpan = document.createElement('span');
                textSpan.className = 'search-result-text';

                var titleSpan = document.createElement('span');
                titleSpan.className = 'search-result-title';
                titleSpan.textContent = t.label;

                var descSpan = document.createElement('span');
                descSpan.className = 'search-result-desc';
                descSpan.textContent = t.desc;

                textSpan.appendChild(document.createTextNode('\n    '));
                textSpan.appendChild(titleSpan);
                textSpan.appendChild(document.createTextNode('\n    '));
                textSpan.appendChild(descSpan);
                textSpan.appendChild(document.createTextNode('\n  '));

                a.appendChild(textSpan);

                a.appendChild(document.createTextNode('\n  '));

                var arrowI = document.createElement('i');
                arrowI.className = 'fa-solid fa-arrow-right search-result-arrow';
                a.appendChild(arrowI);

                a.appendChild(document.createTextNode('\n'));

                searchResults.appendChild(a);
            });

            activeIndex = q.length > 0 ? 0 : -1;
        }

        function setActiveResult(index) {
            var items = searchResults.querySelectorAll('.search-result');
            if (items.length === 0) return;
            items.forEach(function(el) { el.classList.remove('active'); });
            if (index >= 0 && index < items.length) {
                items[index].classList.add('active');
                items[index].scrollIntoView({ block: 'nearest' });
            }
            activeIndex = index;
        }

        searchInput.addEventListener('input', function() {
            renderResults(searchInput.value);
        });

        searchInput.addEventListener('keydown', function(e) {
            var items = searchResults.querySelectorAll('.search-result');
            var count = items.length;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveResult(activeIndex < count - 1 ? activeIndex + 1 : 0);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveResult(activeIndex > 0 ? activeIndex - 1 : count - 1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeIndex >= 0 && activeIndex < count) {
                    items[activeIndex].click();
                }
            } else if (e.key === 'Escape') {
                closeSearch();
            }
        });

        // Close on backdrop click
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeSearch();
        });

        // Open search on button click
        if (searchButton) {
            searchButton.addEventListener('click', openSearch);
        }

        // Keyboard shortcut: Cmd/Ctrl+K
        document.addEventListener('keydown', function(e) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (overlay.classList.contains('open')) {
                    closeSearch();
                } else {
                    openSearch();
                }
            }
            // Also allow / to open search when not in an input
            if (e.key === '/' && !overlay.classList.contains('open')) {
                var tag = (e.target.tagName || '').toLowerCase();
                if (tag !== 'input' && tag !== 'textarea' && !e.target.isContentEditable) {
                    e.preventDefault();
                    openSearch();
                }
            }
        });

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
                        // Triggers screen reader announcement (via role="alert")
                        msg.style.display = "block";
                        setTimeout(function() {
                            msg.style.display = "none";
                        }, 3000);
                    }

                    // Button visual feedback
                    if (!btn.classList.contains('success')) {
                        btn.dataset.originalHtml = btn.innerHTML;
                        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                        btn.classList.add('success');
                    }

                    // Clear previous timeout if any
                    if (btn.dataset.timeoutId) {
                        clearTimeout(parseInt(btn.dataset.timeoutId, 10));
                    }

                    var timeoutId = setTimeout(function() {
                        if (btn.dataset.originalHtml) {
                            btn.innerHTML = btn.dataset.originalHtml;
                        }
                        btn.classList.remove('success');
                        delete btn.dataset.timeoutId;
                        delete btn.dataset.originalHtml;
                    }, 2000);

                    btn.dataset.timeoutId = timeoutId;
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

    // Enhance external links (accessibility & UX)
    var externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(function (link) {
        // Skip if it contains an image
        if (link.querySelector('img')) return;

        // Add visual icon if missing
        var icon = link.querySelector('.fa-arrow-up-right-from-square');
        if (!icon) {
            icon = document.createElement('i');
            icon.className = 'fa-solid fa-arrow-up-right-from-square';
            icon.style.marginLeft = '0.35em';
            icon.style.fontSize = '0.75em';
            link.appendChild(icon);
        }

        // Ensure icon is hidden from screen readers (redundant with text below)
        if (!icon.getAttribute('aria-hidden')) {
            icon.setAttribute('aria-hidden', 'true');
        }

        // Add SR text if missing
        if (!link.querySelector('.sr-only')) {
            var srText = document.createElement('span');
            srText.className = 'sr-only';
            srText.textContent = ' (opens in a new tab)';
            link.appendChild(srText);
        }

        // Security: Add rel="noopener noreferrer" to prevent reverse tabnabbing
        // This is only applied if target="_blank" is present (which is guaranteed by the selector)
        // and if it's an external link (implied by typical usage, but enforced here).
        // We do not want to hide the referrer for internal links if they accidentally have target="_blank",
        // but target="_blank" on internal links is generally discouraged anyway.
        // Given the selector 'a[target="_blank"]', we should enforce safety regardless of destination
        // to prevent tabnabbing if an internal page is compromised or redirects.

        var rel = link.getAttribute('rel') || '';
        // Optimization: match(/\S+/g) avoids intermediate string allocations created by split().filter()
        var relTokens = rel.match(/\S+/g) || [];

        if (relTokens.indexOf('noopener') === -1) {
            relTokens.push('noopener');
        }
        if (relTokens.indexOf('noreferrer') === -1) {
            relTokens.push('noreferrer');
        }
        link.setAttribute('rel', relTokens.join(' '));
    });

    // Estimated Reading Time
    function initReadingTime() {
        var banner = document.querySelector('.page-banner');
        var mainContent = document.querySelector('main');

        if (!banner || !mainContent) return;

        // Use textContent to get only text, not HTML tags
        var text = mainContent.textContent || '';

        // Optimization: Iterating characters avoids allocating thousands of short strings via split()
        var wordCount = 0;
        var inWord = false;
        var len = text.length;
        for (var i = 0; i < len; i++) {
            var charCode = text.charCodeAt(i);
            // Check for space, tab, newline, carriage return
            if (charCode === 32 || charCode === 9 || charCode === 10 || charCode === 13) {
                inWord = false;
            } else if (!inWord) {
                wordCount++;
                inWord = true;
            }
        }

        // Only show for substantial content (> 100 words)
        if (wordCount < 100) return;

        // Assume average reading speed of 200 wpm
        var minutes = Math.ceil(wordCount / 200);

        var readingTimeEl = document.createElement('div');
        readingTimeEl.className = 'reading-time';
        readingTimeEl.innerHTML = '<i class="fa-solid fa-clock"></i> ' + minutes + ' min read';

        banner.appendChild(readingTimeEl);
    }

    initReadingTime();

    // Accessibility: Close menus with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close desktop dropdowns
            var openDropdowns = document.querySelectorAll('.menu-dropdown.open');
            openDropdowns.forEach(function(menu) {
                menu.classList.remove('open');
                var trigger = menu.querySelector('.menu-trigger');
                if (trigger) {
                    trigger.setAttribute('aria-expanded', 'false');
                    // Only restore focus if focus was inside the menu
                    if (menu.contains(document.activeElement)) {
                        trigger.focus();
                    }
                }
            });

            // Close mobile nav
            var headerNav = document.querySelector('header nav');
            var hamburgerBtn = document.querySelector('.hamburger');
            if (headerNav && headerNav.classList.contains('open') && hamburgerBtn) {
                headerNav.classList.remove('open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                var icon = hamburgerBtn.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
                if (headerNav.contains(document.activeElement)) {
                    hamburgerBtn.focus();
                }
            }
        }
    });
});
