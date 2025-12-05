// --- 1. INITIALIZATION & LUCIDE ICONS ---
// Initialize icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// Remove loader after load or timeout
function removeLoader() {
    const loader = document.getElementById('loader');
    const navbar = document.querySelector('nav');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            if (loader.parentNode) loader.remove();
            // Show navbar after loader is removed
            if (navbar) {
                navbar.style.display = 'block';
            }
        }, 500);
    }
}

// Hide navbar initially
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('nav');
    if (navbar) {
        navbar.style.display = 'none';
    }
});

// Remove loader after 3 seconds
setTimeout(() => removeLoader(), 3000);

// --- 2. NAVIGATION LOGIC (SPA FEEL) ---
function navigateTo(sectionId) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Show target section
    document.getElementById(sectionId).classList.add('active');

    // Update Nav State
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-cyber-primary', 'scale-110');
        btn.classList.add('text-gray-400');
    });
    
    // Highlight active button (approximate matching)
    const activeBtn = Array.from(document.querySelectorAll('.nav-btn')).find(b => 
        b.getAttribute('onclick').includes(sectionId)
    );
    if(activeBtn) {
        activeBtn.classList.remove('text-gray-400');
        activeBtn.classList.add('text-cyber-primary', 'scale-110');
    }
}

// --- 3. THEME TOGGLE LOGIC ---
const htmlElement = document.documentElement;

// Clear cache on page load
localStorage.clear();
sessionStorage.clear();

// Default to light mode
let isDark = false;

// Initialize with saved theme (prevent flash)
function initTheme() {
    const html = document.documentElement;
    
    // Remove transitions briefly to prevent flash
    html.classList.add('no-transition');
    
    if (isDark) {
        html.classList.add('dark');
        html.classList.remove('light');
    } else {
        html.classList.remove('dark');
        html.classList.add('light');
    }
    
    // Force reflow and then re-enable transitions
    void html.offsetWidth;
    setTimeout(() => {
        html.classList.remove('no-transition');
    }, 10);
    
    // Initialize 3D theme if ready
    setTimeout(() => {
        if (typeof update3DTheme === 'function') {
            update3DTheme(isDark);
        }
    }, 100);
    
    // Initialize icon visibility
    const navThemeToggle = document.getElementById('nav-theme-toggle');
    if (navThemeToggle) {
        const sunIcon = navThemeToggle.querySelector('[data-lucide="sun"]');
        const moonIcon = navThemeToggle.querySelector('[data-lucide="moon"]');
        if (sunIcon && moonIcon) {
            if (isDark) {
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            } else {
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            }
        }
    }
}

// Call init immediately and on page load
initTheme();
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
});

// Theme toggle handler via navbar button
const navThemeToggle = document.getElementById('nav-theme-toggle');
if (navThemeToggle) {
    navThemeToggle.addEventListener('click', () => {
        isDark = !isDark;
        
        // Update DOM with smooth transition
        htmlElement.classList.toggle('dark');
        htmlElement.classList.toggle('light');
        
        // Save to localStorage
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update 3D Background Colors (if Three.js is ready)
        if (typeof update3DTheme === 'function') {
            update3DTheme(isDark);
        }
        
        // Update icon (sun in dark mode, moon in light mode)
        const sunIcon = navThemeToggle.querySelector('[data-lucide="sun"]');
        const moonIcon = navThemeToggle.querySelector('[data-lucide="moon"]');
        if (sunIcon && moonIcon) {
            if (isDark) {
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            } else {
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            }
        }
    });
}

// --- 4. EMAILJS INTEGRATION ---
(function() {
    // Initialize EmailJS
    emailjs.init("CtQwEFyX5Kq-7gqmJ"); // User ID
})();

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const btn = document.getElementById('submit-btn');
    const status = document.getElementById('form-status');
    
    btn.innerHTML = 'Sending... <i class="animate-spin ml-2">↻</i>';
    btn.disabled = true;

    const serviceID = 'service_tbdm0d2';
    const templateID = 'template_pch5iiw';

    emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
            btn.innerHTML = 'Sent Successfully!';
            btn.classList.add('bg-green-500');
            status.innerHTML = "Thanks! I'll get back to you soon.";
            status.classList.remove('hidden', 'text-red-500');
            status.classList.add('text-green-400');
            document.getElementById('contact-form').reset();
            setTimeout(() => {
                btn.innerHTML = 'Send Message';
                btn.disabled = false;
                btn.classList.remove('bg-green-500');
            }, 3000);
        }, (err) => {
            btn.innerHTML = 'Failed to Send';
            status.innerHTML = "Error: " + JSON.stringify(err);
            status.classList.remove('hidden', 'text-green-400');
            status.classList.add('text-red-500');
            btn.disabled = false;
        });
});

// --- 5. THREE.JS INTERACTIVE BACKGROUND ---
// Wait for DOM to be ready before initializing Three.js
function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Particle System
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 3000;

        const posArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 20; 
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const material = new THREE.PointsMaterial({
            size: 0.03,
            color: 0x00f3ff,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            fog: false
        });

        const particlesMesh = new THREE.Points(particlesGeometry, material);
        scene.add(particlesMesh);

        const gridHelper = new THREE.GridHelper(30, 30, 0xbc13fe, 0x222222);
        gridHelper.position.y = -3;
        gridHelper.rotation.x = 0.3;
        gridHelper.scale.set(1.5, 1.5, 1.5);
        scene.add(gridHelper);

        const torusGeometry = new THREE.TorusGeometry(5, 0.5, 32, 64);
        const torusMaterial = new THREE.MeshStandardMaterial({
            color: 0x00f3ff,
            metalness: 0.7,
            roughness: 0.2,
            wireframe: true,
            emissive: 0x00f3ff,
            emissiveIntensity: 0.3
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.rotation.x = 0.5;
        torus.rotation.z = 0.3;
        torus.position.z = -5;
        scene.add(torus);

        const torusGeometry2 = new THREE.TorusGeometry(3, 0.3, 32, 64);
        const torusMaterial2 = new THREE.MeshStandardMaterial({
            color: 0xbc13fe,
            metalness: 0.6,
            roughness: 0.3,
            wireframe: true,
            emissive: 0xbc13fe,
            emissiveIntensity: 0.2
        });
        const torus2 = new THREE.Mesh(torusGeometry2, torusMaterial2);
        torus2.rotation.y = 0.5;
        torus2.rotation.x = 0.2;
        torus2.position.z = -8;
        torus2.position.x = 2;
        scene.add(torus2);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00f3ff, 1.5);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0xbc13fe, 1);
        pointLight2.position.set(-5, -5, 5);
        scene.add(pointLight2);

        camera.position.z = 5;

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = event.clientX - window.innerWidth / 2;
            mouseY = event.clientY - window.innerHeight / 2;
        });

        function update3DTheme(dark) {
            if(dark) {
                material.color.setHex(0x00f3ff);
                material.opacity = 0.9;
                material.size = 0.03;
                gridHelper.material.opacity = 0.4;
                gridHelper.material.color.setHex(0xbc13fe);
                torusMaterial.color.setHex(0x00f3ff);
                torusMaterial.emissive.setHex(0x00f3ff);
                torusMaterial.emissiveIntensity = 0.3;
                torusMaterial2.color.setHex(0xbc13fe);
                torusMaterial2.emissive.setHex(0xbc13fe);
                torusMaterial2.emissiveIntensity = 0.2;
                ambientLight.intensity = 0.4;
                pointLight.intensity = 1.5;
                pointLight2.intensity = 1.0;
                renderer.setClearColor(0x000000, 0);
                document.getElementById('bg-canvas').style.filter = "invert(0)";
            } else {
                // Light mode - MAXIMUM visibility with prominent grid
                material.color.setHex(0x0055ff);
                material.opacity = 1.0;
                material.size = 0.08;
                gridHelper.material.opacity = 1.0;
                gridHelper.material.color.setHex(0x001a66);
                gridHelper.material.linewidth = 2;
                torusMaterial.color.setHex(0x0055ff);
                torusMaterial.emissive.setHex(0x0055ff);
                torusMaterial.emissiveIntensity = 1.2;
                torusMaterial.opacity = 1.0;
                torusMaterial2.color.setHex(0x6600ff);
                torusMaterial2.emissive.setHex(0x6600ff);
                torusMaterial2.emissiveIntensity = 1.0;
                torusMaterial2.opacity = 1.0;
                ambientLight.intensity = 1.5;
                pointLight.intensity = 3.5;
                pointLight2.intensity = 2.5;
                renderer.setClearColor(0xc3e0fa, 1);
                document.getElementById('bg-canvas').style.filter = "invert(0)";
            }
        }

        const clock = new THREE.Clock();

        function animate() {
            const elapsedTime = clock.getElapsedTime();

            targetX = mouseX * 0.0008;
            targetY = mouseY * 0.0008;

            particlesMesh.rotation.y += 0.3 * (targetX - particlesMesh.rotation.y);
            particlesMesh.rotation.x += 0.3 * (targetY - particlesMesh.rotation.x);
            
            particlesMesh.rotation.z = elapsedTime * 0.03;

            gridHelper.position.z = Math.sin(elapsedTime * 0.3) * 2;
            gridHelper.rotation.z = elapsedTime * 0.05;

            torus.rotation.x += 0.001;
            torus.rotation.y += 0.002;
            torus.position.z = -5 + Math.sin(elapsedTime * 0.5) * 2;
            torus.scale.set(
                1 + Math.sin(elapsedTime * 0.4) * 0.1,
                1 + Math.sin(elapsedTime * 0.4 + 1) * 0.1,
                1 + Math.sin(elapsedTime * 0.4 + 2) * 0.1
            );

            torus2.rotation.x -= 0.0015;
            torus2.rotation.y -= 0.0025;
            torus2.rotation.z += 0.001;
            torus2.position.z = -8 + Math.cos(elapsedTime * 0.4) * 2;
            torus2.position.y = Math.sin(elapsedTime * 0.3) * 1.5;

            pointLight.position.x = Math.sin(elapsedTime * 0.5) * 8;
            pointLight.position.y = Math.cos(elapsedTime * 0.4) * 5;
            
            gridHelper.material.opacity = 0.3 + Math.sin(elapsedTime * 0.6) * 0.2;
            
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

    } catch (error) {
        console.error('Error initializing Three.js:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeJS);
} else {
    initThreeJS();
}