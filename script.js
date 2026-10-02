const canvas = document.getElementById("background-canvas");
const context = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.size = Math.random() * 2 + 0.5;

        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;

        this.opacity = Math.random() * 0.8 + 0.2;

        const colors = [
            "168, 85, 247",
            "236, 72, 153",
            "34, 211, 238"
        ];

        this.color =
            colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) {
            this.speedX *= -1;
        }

        if (this.y < 0 || this.y > canvas.height) {
            this.speedY *= -1;
        }
    }

    draw() {
        context.beginPath();

        context.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        context.fillStyle =
            `rgba(${this.color}, ${this.opacity})`;

        context.shadowBlur = 12;
        context.shadowColor =
            `rgba(${this.color}, 0.8)`;

        context.fill();
    }
}

function createParticles() {
    particles = [];

    const amount = Math.min(
        Math.floor(
            (window.innerWidth * window.innerHeight) / 13000
        ),
        130
    );

    for (let i = 0; i < amount; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;

            const distance = Math.sqrt(
                dx * dx + dy * dy
            );

            if (distance < 125) {
                const opacity = 1 - distance / 125;

                context.beginPath();

                context.strokeStyle =
                    `rgba(168, 85, 247, ${opacity * 0.18})`;

                context.lineWidth = 1;

                context.moveTo(
                    particles[i].x,
                    particles[i].y
                );

                context.lineTo(
                    particles[j].x,
                    particles[j].y
                );

                context.stroke();
            }
        }
    }
}

function animateParticles() {
    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });

    connectParticles();

    requestAnimationFrame(animateParticles);
}

resizeCanvas();
createParticles();
animateParticles();

window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
});

/* Cursor luminoso */

const cursorGlow = document.querySelector(".cursor-glow");

document.addEventListener("mousemove", (event) => {
    if (!cursorGlow) {
        return;
    }

    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
});

/* Efeito 3D dos cards */

const tiltCards = document.querySelectorAll(".tilt-card");

tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX =
            ((y - centerY) / centerY) * -5;

        const rotateY =
            ((x - centerX) / centerX) * 5;

        card.style.transform = `
            perspective(900px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateZ(8px)
        `;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = `
            perspective(900px)
            rotateX(0deg)
            rotateY(0deg)
            translateZ(0)
        `;
    });
});

/* Animação das seções ao aparecerem */

const sections = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    },
    {
        threshold: 0.15
    }
);

sections.forEach((section) => {
    observer.observe(section);
});

/* Formulário */

const form = document.querySelector(".formulario-contato");
const formMessage = document.getElementById("mensagem-formulario");

if (form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const button = form.querySelector("button");

        button.textContent = "Mensagem enviada ✓";

        button.style.background =
            "linear-gradient(100deg, #22d3ee, #16803c)";

        formMessage.textContent =
            "Obrigado pelo contato! Em breve responderei sua mensagem.";

        form.reset();

        setTimeout(() => {
            button.textContent = "Enviar mensagem";

            button.style.background =
                "linear-gradient(100deg, #a855f7, #ec4899)";
        }, 3000);
    });
}