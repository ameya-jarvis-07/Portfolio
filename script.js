// Smooth scroll for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // Don't prevent default for external links
        if (this.getAttribute('target') === '_blank') return;
        
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
    });
});

// Add scroll animation to cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.project-card, .skill-card, .quick-link-card, .contact-info-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// Interactive mouse follower orb
const interactiveOrb = document.createElement('div');
interactiveOrb.className = 'gradient-orb';
interactiveOrb.style.width = '400px';
interactiveOrb.style.height = '400px';
interactiveOrb.style.background = 'radial-gradient(circle, rgba(140, 100, 255, 0.5) 0%, transparent 70%)';
interactiveOrb.style.pointerEvents = 'none';
interactiveOrb.style.transition = 'all 0.3s ease';
interactiveOrb.style.zIndex = '-1';
document.querySelector('.background-container').appendChild(interactiveOrb);

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    interactiveOrb.style.left = (x - 200) + 'px';
    interactiveOrb.style.top = (y - 200) + 'px';
});

// Add floating particles effect
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.5 + 0.2};
    `;
    document.querySelector('.background-container').appendChild(particle);
}

// Create particles
for (let i = 0; i < 50; i++) {
    setTimeout(() => createParticle(), i * 100);
}

// Add particle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
        }
        10% {
            opacity: 0.5;
        }
        90% {
            opacity: 0.5;
        }
        100% {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Sidebar resize handler for main content
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');

if (sidebar && mainContent) {
    sidebar.addEventListener('mouseenter', () => {
        mainContent.style.marginLeft = 'var(--sidebar-width-expanded)';
        mainContent.style.width = 'calc(100% - var(--sidebar-width-expanded))';
    });

    sidebar.addEventListener('mouseleave', () => {
        mainContent.style.marginLeft = 'var(--sidebar-width-collapsed)';
        mainContent.style.width = 'calc(100% - var(--sidebar-width-collapsed))';
    });
}

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', formData);
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// Add gradient animation to CTA button
const ctaButtons = document.querySelectorAll('.cta-button');
ctaButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        button.style.setProperty('--x', x + 'px');
        button.style.setProperty('--y', y + 'px');
    });
});

// Set active navigation based on current page
window.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.includes(currentPage) || (currentPage === '' && href === 'index.html'))) {
            link.classList.add('active');
        }
    });
});

console.log('Portfolio loaded successfully! ✨');
