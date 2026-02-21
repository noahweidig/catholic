document.addEventListener('DOMContentLoaded', function () {
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
        var transitioning = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    if (!transitioning) {
                        if (window.scrollY > 80 && !header.classList.contains('scrolled')) {
                            header.classList.add('scrolled');
                            transitioning = true;
                            setTimeout(function () { transitioning = false; }, 450);
                        } else if (window.scrollY < 5 && header.classList.contains('scrolled')) {
                            header.classList.remove('scrolled');
                            transitioning = true;
                            setTimeout(function () { transitioning = false; }, 450);
                        }
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
            hamburger.setAttribute('aria-expanded', isOpen);
            var icon = hamburger.querySelector('i');
            if (icon) {
                icon.className = isOpen
                    ? 'fa-solid fa-xmark'
                    : 'fa-solid fa-bars';
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
});
