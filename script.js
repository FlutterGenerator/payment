class ParticleSystem {
    constructor() {
      this.particles = [];
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");
  
      Object.assign(this.canvas.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: "-1",
        pointerEvents: "none"
      });
  
      document.body.appendChild(this.canvas);
  
      this.mouse = { x: undefined, y: undefined, radius: 150 };
  
      this.resizeCanvas();
      this.createParticles();
      this.animate();
  
      window.addEventListener("resize", () => this.resizeCanvas());
      document.addEventListener("mousemove", e => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });
    }
  
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.createParticles();
    }
  
    createParticles() {
      this.particles = [];
      const count = Math.min(150, (this.canvas.width * this.canvas.height) / 15000);
  
      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 2 + 1;
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius,
          baseRadius: radius,
          speedX: 0.7 * (Math.random() - 0.5),
          speedY: 0.7 * (Math.random() - 0.5),
          opacity: Math.random() * 0.5 + 0.5,
          baseOpacity: Math.random() * 0.5 + 0.5,
          color: `rgba(0, 180, 255, ${Math.random() * 0.5 + 0.5})`,
          glowIntensity: Math.random()
        });
      }
    }
  
    drawParticles() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      this.particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
  
        if (p.x < 0) p.x = this.canvas.width;
        if (p.x > this.canvas.width) p.x = 0;
        if (p.y < 0) p.y = this.canvas.height;
        if (p.y > this.canvas.height) p.y = 0;
  
        if (this.mouse.x !== undefined && this.mouse.y !== undefined) {
          const dx = this.mouse.x - p.x;
          const dy = this.mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
  
          if (dist < this.mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const repulse = (this.mouse.radius - dist) / this.mouse.radius;
            p.x -= Math.cos(angle) * repulse * 2;
            p.y -= Math.sin(angle) * repulse * 2;
          }
        }
  
        const glowFactor = 0.5 * Math.sin(0.003 * Date.now() + 10 * p.glowIntensity) + 0.5;
        p.radius = p.baseRadius * (1 + 0.3 * glowFactor);
        p.opacity = p.baseOpacity * (0.8 + 0.2 * glowFactor);
  
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  
        const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 2 * p.radius);
        gradient.addColorStop(0, `rgba(0, 180, 255, ${p.opacity})`);
        gradient.addColorStop(1, "rgba(0, 180, 255, 0)");
  
        this.ctx.fillStyle = gradient;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = "rgba(0, 180, 255, 0.5)";
        this.ctx.fill();
        this.ctx.restore();
      });
  
      this.drawConnections();
    }
  
    drawConnections() {
      this.particles.forEach((a, i) => {
        this.particles.slice(i + 1).forEach(b => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
  
          if (dist < 100) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(0, 180, 255, ${0.2 * (1 - dist / 100)})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(b.x, b.y);
            this.ctx.stroke();
          }
        });
      });
    }
  
    animate() {
      this.drawParticles();
      requestAnimationFrame(() => this.animate());
    }
  }
  
  function copyToClipboard(text) {
    const cleanText = text.replace(/-/g, "");
    navigator.clipboard.writeText(cleanText).then(() => {
      showToast("Number copied successfully!", "success");
    }).catch(err => {
      showToast("Failed to copy number", "error");
      console.error("Failed to copy:", err);
    });
  }
  
  function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    const icon = toast.querySelector("i");
    const text = toast.querySelector("span");
  
    text.textContent = message;
    toast.className = `toast ${type}`;
    icon.className = type === "success" ? "fas fa-check-circle" : "fas fa-times-circle";
  
    toast.classList.add("show");
  
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    new ParticleSystem();
  
    document.querySelectorAll(".copy-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const number = this.getAttribute("data-number");
        copyToClipboard(number);
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "scale(1)";
        }, 200);
      });
    });
  
    document.querySelectorAll(".payment-method").forEach(card => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-5px)";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
      });
    });
  });
  
  // Error fallback
  window.onerror = function (msg, url, line, col, error) {
    console.error(`Error: ${msg}\nURL: ${url}\nLine: ${line}\nColumn: ${col}\nError object: ${JSON.stringify(error)}`);
    return false;
  };
  
  // Polyfill for requestAnimationFrame
  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      return setTimeout(callback, 1000 / 60);
    };
  
