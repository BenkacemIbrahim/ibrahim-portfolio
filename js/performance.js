// Performance monitoring and optimization
class PerformanceMonitor {
  constructor() {
    this.fps = 0
    this.frameCount = 0
    this.lastTime = performance.now()
    this.fpsHistory = []
    this.maxHistoryLength = 60

    this.init()
  }

  init() {
    this.startFPSMonitoring()
    this.optimizeImages()
    this.preloadCriticalResources()
    this.setupIntersectionObserver()
    this.monitorMemoryUsage()
  }

  startFPSMonitoring() {
    const updateFPS = () => {
      this.frameCount++
      const currentTime = performance.now()
      const deltaTime = currentTime - this.lastTime

      if (deltaTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / deltaTime)
        this.fpsHistory.push(this.fps)

        if (this.fpsHistory.length > this.maxHistoryLength) {
          this.fpsHistory.shift()
        }

        this.updateFPSDisplay()
        this.frameCount = 0
        this.lastTime = currentTime

        // Performance warnings
        if (this.fps < 30) {
          this.handleLowFPS()
        }
      }

      requestAnimationFrame(updateFPS)
    }

    updateFPS()
  }

  updateFPSDisplay() {
    const fpsElements = document.querySelectorAll("#fps-value, #fps-value-mobile")
    fpsElements.forEach((element) => {
      if (element) {
        element.textContent = this.fps

        // Color coding based on FPS
        if (this.fps >= 50) {
          element.style.color = "#10b981" // green
        } else if (this.fps >= 30) {
          element.style.color = "#f59e0b" // yellow
        } else {
          element.style.color = "#ef4444" // red
        }
      }
    })
  }

  handleLowFPS() {
    console.warn("Low FPS detected:", this.fps)

    // Reduce particle count
    const particleElements = document.querySelectorAll("#floating-particles div")
    if (particleElements.length > 10) {
      for (let i = 10; i < particleElements.length; i++) {
        particleElements[i].remove()
      }
    }

    // Disable matrix rain on low-end devices
    const matrixCanvas = document.getElementById("matrix-rain")
    if (matrixCanvas) {
      matrixCanvas.style.display = "none"
    }

    // Reduce animation complexity
    document.documentElement.style.setProperty("--animation-duration", "2s")
  }

  optimizeImages() {
    const images = document.querySelectorAll("img")

    images.forEach((img) => {
      // Add loading="lazy" if not present
      if (!img.hasAttribute("loading")) {
        img.setAttribute("loading", "lazy")
      }

      // Optimize image loading
      img.addEventListener("load", () => {
        img.style.opacity = "1"
      })

      img.addEventListener("error", () => {
        console.warn("Failed to load image:", img.src)
        img.style.display = "none"
      })
    })
  }

  preloadCriticalResources() {
    const criticalResources = ["styles.css", "js/main.js", "/placeholder.svg?height=320&width=320"]

    criticalResources.forEach((resource) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.href = resource

      if (resource.endsWith(".css")) {
        link.as = "style"
      } else if (resource.endsWith(".js")) {
        link.as = "script"
      } else {
        link.as = "image"
      }

      document.head.appendChild(link)
    })
  }

  setupIntersectionObserver() {
    // Pause animations when elements are not visible
    const animatedElements = document.querySelectorAll(".animate-spin, .animate-pulse, .animate-bounce")

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.animationPlayState = "running"
            } else {
              entry.target.style.animationPlayState = "paused"
            }
          })
        },
        { threshold: 0.1 },
      )

      animatedElements.forEach((element) => {
        observer.observe(element)
      })
    }
  }

  monitorMemoryUsage() {
    if ("memory" in performance) {
      setInterval(() => {
        const memory = performance.memory
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576)
        const totalMB = Math.round(memory.totalJSHeapSize / 1048576)

        console.log(`Memory usage: ${usedMB}MB / ${totalMB}MB`)

        // Warning if memory usage is high
        if (usedMB > 100) {
          console.warn("High memory usage detected")
          this.cleanupMemory()
        }
      }, 30000) // Check every 30 seconds
    }
  }

  cleanupMemory() {
    // Remove unused event listeners
    const oldElements = document.querySelectorAll("[data-cleanup]")
    oldElements.forEach((element) => {
      element.remove()
    })

    // Clear large arrays
    if (window.particlesJS && window.pJSDom) {
      window.pJSDom.forEach((dom) => {
        if (dom.pJS.particles.array.length > 50) {
          dom.pJS.particles.array.splice(50)
        }
      })
    }

    // Force garbage collection if available
    if (window.gc) {
      window.gc()
    }
  }

  getAverageFPS() {
    if (this.fpsHistory.length === 0) return 0
    return Math.round(this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length)
  }

  getPerformanceReport() {
    return {
      currentFPS: this.fps,
      averageFPS: this.getAverageFPS(),
      memoryUsage: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : "N/A",
      connectionType: navigator.connection ? navigator.connection.effectiveType : "unknown",
    }
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor()

// Expose to global scope for debugging
window.performanceMonitor = performanceMonitor

// Network-aware loading
if ("connection" in navigator) {
  const connection = navigator.connection

  if (connection.effectiveType === "slow-2g" || connection.effectiveType === "2g") {
    // Disable heavy animations on slow connections
    document.documentElement.classList.add("reduced-motion")

    // Reduce particle count
    const particleConfig = {
      particles: {
        number: { value: 20 },
      },
    }

    if (window.particlesJS) {
      window.particlesJS("particles-js", particleConfig)
    }
  }
}

// Battery API optimization
if ("getBattery" in navigator) {
  navigator.getBattery().then((battery) => {
    if (battery.level < 0.2 || !battery.charging) {
      // Reduce animations when battery is low
      document.documentElement.classList.add("power-save-mode")
      console.log("Power save mode activated")
    }
  })
}

// Visibility API to pause animations when tab is not active
document.addEventListener("visibilitychange", () => {
  const animatedElements = document.querySelectorAll(".animate-spin, .animate-pulse, .animate-bounce")

  if (document.hidden) {
    animatedElements.forEach((element) => {
      element.style.animationPlayState = "paused"
    })
  } else {
    animatedElements.forEach((element) => {
      element.style.animationPlayState = "running"
    })
  }
})
