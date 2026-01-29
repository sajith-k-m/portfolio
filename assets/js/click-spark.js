class ClickSpark extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.root = document.documentElement;
        this.svg;
        this.sparks = [];
    }

    connectedCallback() {
        this.setupSpark();
        this.root.addEventListener("click", (e) => this.animateSpark(e));
    }

    disconnectedCallback() {
        this.root.removeEventListener("click", (e) => this.animateSpark(e));
    }

    setupSpark() {
        const template = `
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
          pointer-events: none;
        }
      </style>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"></svg>
    `;

        this.shadowRoot.innerHTML = template;
        this.svg = this.shadowRoot.querySelector("svg");
    }

    setSparkPosition(x, y) {
        // This method is not strictly needed for the SVG approach but kept for potential extensions
    }

    animateSpark(e) {
        const startX = e.clientX;
        const startY = e.clientY;

        // User configurable options via attributes on the custom element
        const color = this.getAttribute('spark-color') || '#fff';
        const size = parseInt(this.getAttribute('spark-size')) || 10;
        const radius = parseInt(this.getAttribute('spark-radius')) || 15;
        const count = parseInt(this.getAttribute('spark-count')) || 8;
        const duration = parseInt(this.getAttribute('duration')) || 400;
        const ease = this.getAttribute('easing') || 'ease-out';

        const now = performance.now();

        for (let i = 0; i < count; i++) {
            const angle = (2 * Math.PI * i) / count;
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

            line.setAttribute("stroke", color);
            line.setAttribute("stroke-width", "2");
            line.setAttribute("stroke-linecap", "round");

            this.svg.appendChild(line);

            this.sparks.push({
                el: line,
                x: startX,
                y: startY,
                angle: angle,
                startTime: now,
                duration: duration,
                radius: radius,
                size: size,
                ease: ease
            });
        }

        if (this.sparks.length > 0 && !this.animating) {
            this.animating = true;
            requestAnimationFrame((t) => this.tick(t));
        }
    }

    ease(t, type) {
        switch (type) {
            case 'linear': return t;
            case 'ease-in': return t * t;
            case 'ease-in-out': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            default: return t * (2 - t); // ease-out
        }
    }

    tick(timestamp) {
        if (this.sparks.length === 0) {
            this.animating = false;
            return;
        }

        this.sparks = this.sparks.filter(spark => {
            const elapsed = timestamp - spark.startTime;
            if (elapsed >= spark.duration) {
                spark.el.remove();
                return false;
            }

            const progress = elapsed / spark.duration;
            const eased = this.ease(progress, spark.ease);

            const distance = eased * spark.radius;
            const lineLength = spark.size * (1 - eased);

            const x1 = spark.x + distance * Math.cos(spark.angle);
            const y1 = spark.y + distance * Math.sin(spark.angle);
            const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
            const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

            spark.el.setAttribute("x1", x1);
            spark.el.setAttribute("y1", y1);
            spark.el.setAttribute("x2", x2);
            spark.el.setAttribute("y2", y2);

            return true;
        });

        requestAnimationFrame((t) => this.tick(t));
    }
}

customElements.define("click-spark", ClickSpark);
