class DockMenu extends HTMLElement {
    constructor() {
        super();
        this.items = [];
        this.mouse = { x: Infinity, y: Infinity };
        this.isHovered = false;

        // Animation configuration - Adjusted for Navbar
        this.config = {
            baseSize: 45,
            magnification: 60, // reduced max size
            distance: 150,     // reduced range
            stiffness: 150,
            damping: 15,
            mass: 0.1
        };

        this.rafId = null;
    }

    connectedCallback() {
        // Check if structure already exists (to prevent double init if moving in DOM)
        if (!this.querySelector('.dock-outer')) {
            this.innerHTML = `
        <div class="dock-outer">
            <div class="dock-panel">
            ${this.moveChildrenToPanel()}
            </div>
        </div>
        `;
        }

        this.panel = this.querySelector('.dock-panel');
        this.items = Array.from(this.querySelectorAll('.dock-item'));

        // Initialize item physics state
        this.items.forEach(item => {
            item._physics = {
                size: this.config.baseSize,
                targetSize: this.config.baseSize,
                velocity: 0
            };
        });

        this.setupEventListeners();
        this.startAnimationLoop();
    }

    moveChildrenToPanel() {
        const children = this.innerHTML;
        this.innerHTML = '';
        return children;
    }

    setupEventListeners() {
        this.panel.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.isHovered = true;
        });

        this.panel.addEventListener('mouseleave', () => {
            this.mouse.x = Infinity;
            this.mouse.y = Infinity;
            this.isHovered = false;
        });
    }

    startAnimationLoop() {
        const animate = () => {
            this.updatePhysics();
            this.rafId = requestAnimationFrame(animate);
        };
        this.rafId = requestAnimationFrame(animate);
    }

    updatePhysics() {
        this.items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.left + rect.width / 2;

            const dist = this.mouse.x === Infinity ? Infinity : Math.abs(this.mouse.x - itemCenter);

            let targetSize = this.config.baseSize;

            if (dist < this.config.distance) {
                const val = 1 - Math.min(dist / this.config.distance, 1);
                const scale = Math.sin(val * Math.PI / 2);
                targetSize += (this.config.magnification - this.config.baseSize) * scale;
            }

            const force = (targetSize - item._physics.size) * this.config.stiffness;
            const dampingForce = -item._physics.velocity * this.config.damping;
            const acceleration = (force + dampingForce) / this.config.mass;

            item._physics.velocity += acceleration * (1 / 60);
            item._physics.size += item._physics.velocity * (1 / 60);

            // Apply size
            item.style.width = `${item._physics.size}px`;
            item.style.height = `${item._physics.size}px`;

            // Scale visual content
            const icon = item.querySelector('.dock-icon');
            if (icon) {
                // Subtle icon scaling
                const iconScale = 1 + (item._physics.size - this.config.baseSize) / 100;
                icon.style.transform = `scale(${Math.min(iconScale, 1.5)})`;
                icon.style.fontSize = `${1.1 + (item._physics.size - this.config.baseSize) * 0.02}rem`;
            }
        });
    }

    disconnectedCallback() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
}

if (!customElements.get('dock-menu')) {
    customElements.define('dock-menu', DockMenu);
}
