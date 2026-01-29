/**
 * DecryptedText Effect
 * Ported from React to Vanilla JS
 */

class DecryptedText {
    constructor(elementOrSelector, options = {}) {
        this.element = typeof elementOrSelector === 'string'
            ? document.querySelector(elementOrSelector)
            : elementOrSelector;

        if (!this.element) {
            console.error('DecryptedText: Element not found');
            return;
        }

        this.originalText = options.text || this.element.textContent;
        this.speed = options.speed || 50;
        this.maxIterations = options.maxIterations || 10;
        this.sequential = options.sequential || false;
        this.revealDirection = options.revealDirection || 'start';
        this.useOriginalCharsOnly = options.useOriginalCharsOnly || false;
        this.characters = options.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';
        this.animateOn = options.animateOn || 'hover'; // 'hover', 'view', 'both', 'none'
        this.className = options.className || '';
        this.encryptedClassName = options.encryptedClassName || '';
        this.parentClassName = options.parentClassName || '';

        this.revealedIndices = new Set();
        this.isScrambling = false;
        this.isHovering = false;
        this.hasAnimated = false;
        this.interval = null;

        // Wrap content if needed to match React structure
        // We'll treat the internal structure as a series of spans if we want to style encrypted vs revealed differently
        // For simplicity in this port, if no specific classes are required per char, we might just update textContent.
        // However, user passed 'encryptedClassName' in example, so to support that, we need spans.

        this.init();
    }

    init() {
        if (this.parentClassName) {
            this.element.classList.add(this.parentClassName);
        }

        // Initial render
        this.render(this.originalText, new Set());

        // Event Listeners
        if (this.animateOn === 'hover' || this.animateOn === 'both') {
            this.element.addEventListener('mouseenter', () => {
                this.isHovering = true;
                this.startScramble();
            });
            this.element.addEventListener('mouseleave', () => {
                this.isHovering = false;
                // If animateOn is just hover, we might stop or let it finish. 
                // React code keeps checking isHovering inside interval.
            });
        }

        if (this.animateOn === 'view' || this.animateOn === 'both') {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.isHovering = true;
                        this.hasAnimated = true;
                        this.startScramble();
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(this.element);
        }
    }

    render(displayText, revealedSet) {
        // Clear current content
        this.element.innerHTML = '';

        // Create spans for each character
        const chars = displayText.split('');
        chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;

            const isRevealedOrDone = revealedSet.has(index) || !this.isScrambling || (!this.isHovering && this.hasAnimated && this.animateOn === 'view');
            // Logic tweaks to match React: 
            // React: revealedIndices.has(index) || !isScrambling || !isHovering (if hover controlled)

            if (isRevealedOrDone) {
                if (this.className) span.className = this.className;
            } else {
                if (this.encryptedClassName) span.className = this.encryptedClassName;
            }

            this.element.appendChild(span);
        });
    }

    startScramble() {
        if (this.isScrambling) return;
        this.isScrambling = true;
        this.currentIteration = 0;

        // Initialize revealed indices
        if (this.animateOn === 'view' && this.hasAnimated) {
            // If triggered by view, we don't reset revealed indices immediately if we want to "hold" the result?
            // Actually, typically we start from 0 revealed.
            this.revealedIndices = new Set();
        } else {
            this.revealedIndices = new Set();
        }

        if (this.interval) clearInterval(this.interval);

        this.interval = setInterval(() => {
            this.update();
        }, this.speed);
    }

    update() {
        // Check if we should stop
        // React: if(isHovering) { setIsScrambling(true) ... } else { setDisplayText(text); ... }
        if (!this.isHovering && this.animateOn === 'hover') {
            // Reset to original
            this.render(this.originalText, new Set()); // Or all revealed?
            // React logic: if not hovering, setDisplayText(text), setRevealed(new Set), setIsScrambling(false).
            // This means it snaps back to clean text.
            this.isScrambling = false;
            clearInterval(this.interval);
            // Render clean
            this.element.textContent = this.originalText; // Simple reset
            return;
        }

        // Logic to update revealed indices and text
        let newRevealed = new Set(this.revealedIndices);
        let nextText = '';

        if (this.sequential) {
            if (newRevealed.size < this.originalText.length) {
                const nextIndex = this.getNextIndex(newRevealed);
                newRevealed.add(nextIndex);
                this.revealedIndices = newRevealed;
                nextText = this.shuffleText(this.originalText, newRevealed);
                this.render(nextText, newRevealed);
            } else {
                clearInterval(this.interval);
                this.isScrambling = false;
                this.element.textContent = this.originalText; // Final Clean
            }
        } else {
            // Random reveal
            nextText = this.shuffleText(this.originalText, newRevealed);
            this.render(nextText, newRevealed);

            this.currentIteration++;
            if (this.currentIteration >= this.maxIterations) {
                clearInterval(this.interval);
                this.isScrambling = false;
                this.element.textContent = this.originalText; // Final Clean
            }
        }
    }

    getNextIndex(revealedSet) {
        const textLength = this.originalText.length;
        switch (this.revealDirection) {
            case 'start':
                return revealedSet.size;
            case 'end':
                return textLength - 1 - revealedSet.size;
            case 'center': {
                const middle = Math.floor(textLength / 2);
                const offset = Math.floor(revealedSet.size / 2);
                const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

                if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
                    return nextIndex;
                }

                for (let i = 0; i < textLength; i++) {
                    if (!revealedSet.has(i)) return i;
                }
                return 0;
            }
            default:
                return revealedSet.size;
        }
    }

    shuffleText(originalText, currentRevealed) {
        const availableChars = this.useOriginalCharsOnly
            ? Array.from(new Set(originalText.split(''))).filter(char => char !== ' ')
            : this.characters.split('');

        if (this.useOriginalCharsOnly) {
            const positions = originalText.split('').map((char, i) => ({
                char,
                isSpace: char === ' ',
                index: i,
                isRevealed: currentRevealed.has(i)
            }));

            const nonSpaceChars = positions.filter(p => !p.isSpace && !p.isRevealed).map(p => p.char);

            for (let i = nonSpaceChars.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
            }

            let charIndex = 0;
            return positions
                .map(p => {
                    if (p.isSpace) return ' ';
                    if (p.isRevealed) return originalText[p.index];
                    return nonSpaceChars[charIndex++];
                })
                .join('');
        } else {
            return originalText
                .split('')
                .map((char, i) => {
                    if (char === ' ') return ' ';
                    if (currentRevealed.has(i)) return originalText[i];
                    return availableChars[Math.floor(Math.random() * availableChars.length)];
                })
                .join('');
        }
    }
}
