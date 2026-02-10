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

    // Header shrink on scroll
    var header = document.querySelector('header');
    if (header) {
        var lastScroll = 0;
        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            if (scrollY > 60) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScroll = scrollY;
        }, { passive: true });
    }
});
