const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 100;
const baseColor = { r: 0, g: 245, b: 212 }; // From --primary-color
const maxLinkDistance = 120;

let mouse = {
    x: null,
    y: null,
    radius: 150
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticle() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
    };
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
    }
}

function updateParticles() {
    for (const p of particles) {
        // Bounce off walls
        if (p.x + p.vx > canvas.width || p.x + p.vx < 0) {
            p.vx = -p.vx;
        }
        if (p.y + p.vy > canvas.height || p.y + p.vy < 0) {
            p.vy = -p.vy;
        }

        // Mouse interaction - push away
        if (mouse.x) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                p.vx -= forceDirectionX * force * 0.2;
                p.vy -= forceDirectionY * force * 0.2;
            }
        }
        
        p.x += p.vx;
        p.y += p.vy;
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${p1.opacity})`;
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw lines to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxLinkDistance) {
                const opacity = 1 - (distance / maxLinkDistance);
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${opacity * 0.5})`;
                ctx.lineWidth = 1;
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    updateParticles();
    drawParticles();
    requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener('resize', () => {
    setCanvasSize();
    initParticles();
});

// Initial setup
setCanvasSize();
initParticles();
animate();

document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar Scroll Effect ---
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 10, 31, 0.8)';
            header.style.padding = '0.8rem 5%';
        } else {
            header.style.background = 'rgba(10, 10, 31, 0.6)';
            header.style.padding = '1rem 5%';
        }
    });
}); 