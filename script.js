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
        zIndex: "0",
        pointerEvents: "none"
      });

      document.body.appendChild(this.canvas);
  
      this.mouse = { x: 0, y: 0, radius: 150 };
  
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
      const maxParticles = 300; // Set a maximum particle count limit
      const count = Math.min(maxParticles, (this.canvas.width * this.canvas.height) / 15000);
  
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
  
      const currentTime = Date.now();
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
  
        const glowFactor = 0.5 * Math.sin(0.003 * currentTime + 10 * p.glowIntensity) + 0.5;
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
      const quadtree = new Quadtree({
        x: 0,
        y: 0,
        width: this.canvas.width,
        height: this.canvas.height
      });

      this.particles.forEach(p => quadtree.insert(p));

      this.particles.forEach(a => {
        const range = {
          x: a.x - 100,
          y: a.y - 100,
          width: 200,
          height: 200
        };

        const nearbyParticles = quadtree.query(range);

        nearbyParticles.forEach(b => {
          if (a === b) return;

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
    const cleanText = text.replace(/-/g, "");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cleanText).then(() => {
        showToast("Number copied successfully!", "success");
      }).catch(err => {
        showToast("Failed to copy number", "error");
        console.error("Failed to copy:", err);
      });
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = cleanText;
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        showToast("Number copied successfully!", "success");
      } catch (err) {
        showToast("Failed to copy number", "error");
        console.error("Failed to copy:", err);
      }
      document.body.removeChild(textarea);
    }
            this.ctx.stroke();
          }
        );
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
  window.onerror = function (msg, url, line, col, error) {
    console.error(`Error: ${msg}\nURL: ${url}\nLine: ${line}\nColumn: ${col}\nError object: ${JSON.stringify(error)}`);
    showToast("An unexpected error occurred. Please try again later.", "error");
    return false;
  };
    icon.className = type === "success" ? "fas fa-check-circle" : "fas fa-times-circle";
  
    toast.classList.add("show");
  
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
  class Quadtree {
    constructor(boundary, capacity = 4) {
      this.boundary = boundary;
      this.capacity = capacity;
      this.points = [];
      this.divided = false;
    }

    subdivide() {
      const { x, y, width, height } = this.boundary;
      const halfWidth = width / 2;
      const halfHeight = height / 2;

      this.northeast = new Quadtree({ x: x + halfWidth, y, width: halfWidth, height: halfHeight }, this.capacity);
      this.northwest = new Quadtree({ x, y, width: halfWidth, height: halfHeight }, this.capacity);
      this.southeast = new Quadtree({ x: x + halfWidth, y: y + halfHeight, width: halfWidth, height: halfHeight }, this.capacity);
      this.southwest = new Quadtree({ x, y: y + halfHeight, width: halfWidth, height: halfHeight }, this.capacity);

      this.divided = true;
    }

    insert(point) {
      const { x, y, width, height } = this.boundary;

      if (point.x < x || point.x > x + width || point.y < y || point.y > y + height) {
        return false;
      }

      if (this.points.length < this.capacity) {
        this.points.push(point);
        return true;
      }

      if (!this.divided) {
        this.subdivide();
      }

      return (
        this.northeast.insert(point) ||
        this.northwest.insert(point) ||
        this.southeast.insert(point) ||
        this.southwest.insert(point)
      );
    }

    query(range, found = []) {
      const { x, y, width, height } = this.boundary;

      if (
        range.x > x + width ||
        range.x + range.width < x ||
        range.y > y + height ||
        range.y + range.height < y
      ) {
        return found;
      }

      for (const point of this.points) {
        if (
          point.x >= range.x &&
          point.x <= range.x + range.width &&
          point.y >= range.y &&
          point.y <= range.y + range.height
        ) {
          found.push(point);
        }
      }

      if (this.divided) {
        this.northwest.query(range, found);
        this.northeast.query(range, found);
        this.southwest.query(range, found);
        this.southeast.query(range, found);
      }

      return found;
    }
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
      function (callback) {
        return setTimeout(callback, 1000 / 60);
      };
