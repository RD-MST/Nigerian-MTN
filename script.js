// ═══════════════════════════════════════════════════════════════════════
// UNIVERSAL UTM HANDLER - НЕ ТРОГАТЬ, РАБОТАЕТ АВТОМАТИЧЕСКИ
// ═══════════════════════════════════════════════════════════════════════
(function() {
    'use strict';

    function getAllUrlParams() {
        var params = {};
        var searchParams = window.location.search;
        if (!searchParams || searchParams.length <= 1) return params;

        var pairs = searchParams.substring(1).split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            var key = decodeURIComponent(pair[0]);
            var value = pair[1] ? decodeURIComponent(pair[1].replace(/\+/g, ' ')) : '';
            if (key) params[key] = value;
        }
        return params;
    }

    function buildOfferUrl(baseUrl, params) {
        var queryParams = [];
        for (var key in params) {
            if (params.hasOwnProperty(key) && params[key]) {
                queryParams.push(
                    encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
                );
            }
        }
        return queryParams.length > 0 ? baseUrl + '?' + queryParams.join('&') : baseUrl;
    }

    window.updateAllCTALinks = function() {
        var baseOfferUrl = 'https://veotrustkol.com/NMVTN7sQ';
        var params = getAllUrlParams();

        // Добавляем обязательный параметр currency=usd для Keitaro
        if (!params.currency) {
            params.currency = 'usd';
        }

        var finalUrl = buildOfferUrl(baseOfferUrl, params);

        console.log('═══ UTM TRACKING ═══');
        console.log('Incoming Parameters:', params);
        console.log('Final Offer URL:', finalUrl);
        console.log('Keitaro will map these parameters:');
        console.log('  - keyword from URL param "keyword"');
        console.log('  - cost from URL param "cost"');
        console.log('  - currency = usd (hardcoded)');
        console.log('  - external_id from URL param "clickid"');
        console.log('  - creative_id from URL param "bannerid"');
        console.log('  - ad_campaign_id from URL param "campaignid"');
        console.log('  - source from URL param "zoneid"');
        console.log('  - sub_id_1 from URL param "sub_id_1"');

        var links = document.querySelectorAll('a[href*="TEMPORARY-OFFER-URL"], a#enterBtn');
        links.forEach(function(link) { link.href = finalUrl; });

        console.log('Updated ' + links.length + ' CTA links');
        console.log('════════════════════');
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.updateAllCTALinks);
    } else {
        window.updateAllCTALinks();
    }

    setTimeout(window.updateAllCTALinks, 500);
    setTimeout(window.updateAllCTALinks, 2000);
})();

// ═══════════════════════════════════════════════════════════════════════
// PAGE INTERACTIVITY - BOXES, MODAL, CONFETTI
// ═══════════════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // DOM Elements
    const boxes = document.querySelectorAll('.box-item');
    const modal = document.getElementById('eligibilityModal');
    const enterBtn = document.getElementById('enterBtn');
    let selectedBox = null;
    let confettiTriggered = false;

    // Initialize
    function init() {
        // Add click handlers to boxes
        boxes.forEach((box, index) => {
            // Use both click and touch events for better mobile support
            box.addEventListener('click', (e) => {
                e.preventDefault();
                handleBoxClick(box, index);
            });
            
            box.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleBoxClick(box, index);
            }, { passive: false });
            
            // Visual feedback on touch
            box.addEventListener('touchstart', (e) => {
                box.style.transform = 'scale(0.95)';
            }, { passive: true });
            
            box.addEventListener('touchcancel', () => {
                box.style.transform = '';
            }, { passive: true });
        });

        // Close modal on overlay click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    // Don't close on overlay click - user must click CTA
                    // closeModal();
                }
            });
        }

        // Ensure UTM tracking is applied
        if (window.updateAllCTALinks) {
            window.updateAllCTALinks();
        }
    }

    // Handle box click
    function handleBoxClick(box, index) {
        if (selectedBox) return; // Prevent multiple selections

        selectedBox = box;
        const boxNumber = box.dataset.box;

        // Add selected class for animation
        box.classList.add('selected');

        // Wait for animation, then show modal
        setTimeout(() => {
            showModal();
        }, 300);
    }

    // Show eligibility modal
    function showModal() {
        if (!modal) return;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Trigger confetti after a short delay
        if (!confettiTriggered) {
            setTimeout(() => {
                triggerConfetti();
                confettiTriggered = true;
            }, 500);
        }

        // Ensure UTM tracking is applied to CTA button
        if (window.updateAllCTALinks) {
            setTimeout(() => {
                window.updateAllCTALinks();
            }, 100);
        }
    }

    // Close modal (not used currently, but available)
    function closeModal() {
        if (!modal) return;

        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Trigger confetti effect
    function triggerConfetti() {
        if (typeof confetti === 'undefined') {
            console.warn('Confetti library not loaded');
            return;
        }

        // MTN colors: yellow, orange, green
        const colors = ['#FFCC00', '#FFA500', '#00C853', '#FFD700'];

        // Main burst
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: colors,
            gravity: 0.8,
            ticks: 200,
        });

        // Additional bursts
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
            });
        }, 250);

        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
            });
        }, 400);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-apply UTM tracking periodically (in case of dynamic updates)
    setInterval(() => {
        if (window.updateAllCTALinks) {
            window.updateAllCTALinks();
        }
    }, 3000);
})();

