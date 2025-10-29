/**
 * Dreamforge Enterprise Landing Page - Interactive Features
 */

// ROI Calculator
function initROICalculator() {
    const teamSizeInput = document.getElementById('teamSize');
    const monthlyInvestment = document.getElementById('monthlyInvestment');
    const monthlySavings = document.getElementById('monthlySavings');
    const netBenefit = document.getElementById('netBenefit');
    const annualROI = document.getElementById('annualROI');

    if (!teamSizeInput) return;

    function calculateROI() {
        const teamSize = parseInt(teamSizeInput.value) || 1;

        // Pricing logic
        let baseCost = 297; // BETA pricing
        let additionalMembers = Math.max(0, teamSize - 3);
        let additionalCost = 0;

        if (additionalMembers > 0) {
            if (teamSize >= 21) {
                // Custom pricing - estimate
                additionalCost = additionalMembers * 67; // ~30% discount
            } else if (teamSize >= 11) {
                // $77/mo each for members 4-20
                additionalCost = additionalMembers * 77;
            } else if (teamSize >= 4) {
                // $87/mo each for members 4-10
                additionalCost = additionalMembers * 87;
            } else {
                // $97/mo each for member 4
                additionalCost = additionalMembers * 97;
            }
        }

        const totalMonthlyCost = baseCost + additionalCost;

        // Expected savings: $2,000 base + $500 per additional trained member
        const expectedSavings = 2000 + (Math.max(0, teamSize - 1) * 500);

        const monthlyNet = expectedSavings - totalMonthlyCost;
        const yearlyROI = monthlyNet * 12;

        // Update UI
        monthlyInvestment.textContent = `$${totalMonthlyCost.toLocaleString()}`;
        monthlySavings.textContent = `$${expectedSavings.toLocaleString()}`;
        netBenefit.textContent = `$${monthlyNet.toLocaleString()}`;
        annualROI.textContent = `$${yearlyROI.toLocaleString()}`;
    }

    teamSizeInput.addEventListener('input', calculateROI);
    calculateROI(); // Initial calculation
}

// Lead Magnet Form Handling
function initLeadForm() {
    const form = document.getElementById('leadForm');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // In production, this would send to your backend/CRM
            // For now, simulate success
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show success message
            form.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                    <h3 style="color: white; margin-bottom: 1rem;">Check Your Email!</h3>
                    <p style="color: var(--gray-300);">
                        We've sent your free guide to your inbox.
                        You should receive it within the next 5 minutes.
                    </p>
                    <p style="color: var(--gray-300); margin-top: 1rem; font-size: 0.875rem;">
                        (Don't forget to check your spam folder)
                    </p>
                </div>
            `;

            // Track conversion (integrate with your analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'generate_lead', {
                    event_category: 'Lead Magnet',
                    event_label: '5 Apps Guide'
                });
            }

        } catch (error) {
            console.error('Form submission error:', error);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            alert('Something went wrong. Please try again or email us directly.');
        }
    });
}

// CTA Button Click Tracking
function initCTATracking() {
    const ctaButtons = document.querySelectorAll('[data-plan]');

    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const plan = button.getAttribute('data-plan');

            // Track click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'begin_checkout', {
                    event_category: 'Pricing',
                    event_label: plan,
                    value: plan === 'beta' ? 297 : 0
                });
            }

            // In production, redirect to checkout or open modal
            window.location.href = `https://checkout.dreamforge.dev?plan=${plan}`;
        });
    });
}

// Smooth Scroll Enhancement
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for sticky nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animate elements on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards and other elements
    const animatedElements = document.querySelectorAll(`
        .stake-card,
        .tech-card,
        .pricing-card,
        .testimonial-card,
        .faq-item,
        .step
    `);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add scroll-based navbar shadow
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
}

// FAQ Accordion (if needed)
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!question || !answer) return;

        // Initially hide answer (if you want accordion behavior)
        // answer.style.display = 'none';

        question.style.cursor = 'pointer';
        question.addEventListener('click', () => {
            const isOpen = answer.style.display !== 'none';

            // Close all others (optional)
            // faqItems.forEach(otherItem => {
            //     otherItem.querySelector('.faq-answer').style.display = 'none';
            // });

            answer.style.display = isOpen ? 'none' : 'block';
        });
    });
}

// Urgency Timer (countdown for BETA spots)
function initUrgencyTimer() {
    const urgencyBlock = document.querySelector('.urgency-block');
    if (!urgencyBlock) return;

    // This would be dynamic in production, pulling from your database
    const totalSpots = 50;
    const currentSpots = 37; // Claimed spots
    const remaining = totalSpots - currentSpots;

    // Update text with real-time data
    const urgencyText = urgencyBlock.querySelector('.urgency-text');
    if (urgencyText) {
        const estimatedDays = Math.ceil(remaining / 4.5); // ~4.5 signups per day
        urgencyText.innerHTML = `
            <strong>${currentSpots} of ${totalSpots} BETA spots already claimed.</strong>
            At current pace, we'll be full in ${estimatedDays} days. After that, pricing goes to $497/month
            and the next cohort doesn't start for 6 weeks.
        `;
    }
}

// Exit Intent Popup (lightweight)
function initExitIntent() {
    let exitShown = false;

    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !exitShown && window.scrollY > 500) {
            exitShown = true;

            // In production, show a modal with a special offer
            const showExitOffer = confirm(
                "Wait! Before you go...\n\n" +
                "Download our FREE guide: '5 Apps Every Small Business Should Build First'\n\n" +
                "Click OK to get your free guide now."
            );

            if (showExitOffer) {
                document.getElementById('lead-magnet')?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// Initialize all features on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initROICalculator();
    initLeadForm();
    initCTATracking();
    initSmoothScroll();
    initScrollAnimations();
    initNavbarScroll();
    initUrgencyTimer();

    // Exit intent - only on desktop
    if (window.innerWidth > 768) {
        initExitIntent();
    }

    console.log('🔥 Dreamforge Enterprise Landing Page Loaded');
});

// Handle form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add real-time form validation
document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = 'var(--accent-red)';

            // Show error message
            let errorMsg = this.parentElement.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                errorMsg.style.color = 'var(--accent-red)';
                errorMsg.style.fontSize = 'var(--font-size-xs)';
                errorMsg.style.marginTop = 'var(--spacing-xs)';
                errorMsg.textContent = 'Please enter a valid email address';
                this.parentElement.appendChild(errorMsg);
            }
        } else {
            this.style.borderColor = '';
            const errorMsg = this.parentElement.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        }
    });
});

// Track time on page for analytics
let timeOnPage = 0;
setInterval(() => {
    timeOnPage += 1;

    // Track milestones
    if (timeOnPage === 30 && typeof gtag !== 'undefined') {
        gtag('event', 'time_on_page', {
            event_category: 'Engagement',
            event_label: '30 seconds',
            value: 30
        });
    }

    if (timeOnPage === 120 && typeof gtag !== 'undefined') {
        gtag('event', 'time_on_page', {
            event_category: 'Engagement',
            event_label: '2 minutes',
            value: 120
        });
    }
}, 1000);

// Track scroll depth
let maxScrollDepth = 0;
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;

    if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = Math.floor(scrollPercent);

        // Track milestones
        if ([25, 50, 75, 100].includes(maxScrollDepth) && typeof gtag !== 'undefined') {
            gtag('event', 'scroll_depth', {
                event_category: 'Engagement',
                event_label: `${maxScrollDepth}%`,
                value: maxScrollDepth
            });
        }
    }
});
