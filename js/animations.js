// Advanced animations and effects
document.addEventListener("DOMContentLoaded", () => {
  // Parallax scrolling effect
  function initParallax() {
    const parallaxElements = document.querySelectorAll("[data-parallax]")

    if (parallaxElements.length === 0) return

    function updateParallax() {
      const scrollTop = window.pageYOffset

      parallaxElements.forEach((element) => {
        const speed = Number.parseFloat(element.getAttribute("data-parallax")) || 0.5
        const yPos = -(scrollTop * speed)
        element.style.transform = `translateY(${yPos}px)`
      })
    }

    // Throttle scroll events for performance
    let ticking = false
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateParallax)
        ticking = true
      }
    }

    window.addEventListener("scroll", () => {
      requestTick()
      ticking = false
    })
  }

  // Magnetic cursor effect
  function initMagneticCursor() {
    const cursor = document.createElement("div")
    cursor.className =
      "fixed w-4 h-4 bg-primary-400 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-150"
    cursor.style.left = "-10px"
    cursor.style.top = "-10px"
    document.body.appendChild(cursor)

    const magneticElements = document.querySelectorAll("a, button, .magnetic")

    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX - 8 + "px"
      cursor.style.top = e.clientY - 8 + "px"
    })

    magneticElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursor.style.transform = "scale(2)"
      })

      element.addEventListener("mouseleave", () => {
        cursor.style.transform = "scale(1)"
      })
    })

    // Hide cursor when leaving window
    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0"
    })

    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = "1"
    })
  }

  // Smooth reveal animations
  function initRevealAnimations() {
    const revealElements = document.querySelectorAll(".reveal")

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed")
              revealObserver.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1 },
      )

      revealElements.forEach((element) => {
        revealObserver.observe(element)
      })
    }
  }

  // Text scramble effect
  function scrambleText(element, finalText, duration = 1000) {
    const chars = "!<>-_\\/[]{}—=+*^?#________"
    let iteration = 0
    const speed = duration / finalText.length

    const interval = setInterval(() => {
      element.textContent = finalText
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return finalText[index]
          }
          return chars[Math.floor(Math.random() * chars.length)]
        })
        .join("")

      if (iteration >= finalText.length) {
        clearInterval(interval)
      }

      iteration += 1 / 3
    }, speed / 10)
  }

  // Initialize scramble effect for glitch elements
  function initScrambleEffect() {
    const glitchElements = document.querySelectorAll(".glitch")

    glitchElements.forEach((element) => {
      const originalText = element.getAttribute("data-text") || element.textContent

      element.addEventListener("mouseenter", () => {
        scrambleText(element, originalText, 500)
      })
    })
  }

  // Floating particles background
  function initFloatingParticles() {
    const particleContainer = document.createElement("div")
    particleContainer.className = "fixed inset-0 pointer-events-none z-0"
    particleContainer.id = "floating-particles"
    document.body.appendChild(particleContainer)

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div")
      particle.className = "absolute w-1 h-1 bg-primary-400 rounded-full opacity-30"
      particle.style.left = Math.random() * 100 + "%"
      particle.style.top = Math.random() * 100 + "%"
      particle.style.animationDelay = Math.random() * 10 + "s"
      particle.style.animationDuration = Math.random() * 20 + 10 + "s"
      particle.style.animation = "float " + particle.style.animationDuration + " infinite linear"

      particleContainer.appendChild(particle)
    }
  }

  // Matrix rain effect
  function initMatrixRain() {
    const canvas = document.createElement("canvas")
    canvas.className = "fixed inset-0 pointer-events-none z-0 opacity-10"
    canvas.id = "matrix-rain"
    document.body.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}".split("")
    const font_size = 10
    const columns = canvas.width / font_size
    const drops = []

    for (let x = 0; x < columns; x++) {
      drops[x] = 1
    }

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#3b82f6"
      ctx.font = font_size + "px monospace"

      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)]
        ctx.fillText(text, i * font_size, drops[i] * font_size)

        if (drops[i] * font_size > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    setInterval(draw, 35)

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    })
  }

  // Ripple effect on click
  function initRippleEffect() {
    document.addEventListener("click", (e) => {
      const ripple = document.createElement("div")
      ripple.className = "fixed pointer-events-none z-50 rounded-full bg-primary-400 opacity-30"
      ripple.style.left = e.clientX - 25 + "px"
      ripple.style.top = e.clientY - 25 + "px"
      ripple.style.width = "50px"
      ripple.style.height = "50px"
      ripple.style.transform = "scale(0)"
      ripple.style.animation = "ripple 0.6s linear"

      document.body.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  }

  // Initialize all animations
  initParallax()
  initMagneticCursor()
  initRevealAnimations()
  initScrambleEffect()
  initFloatingParticles()
  initRippleEffect()

  // Only init matrix rain on desktop for performance
  if (window.innerWidth > 768) {
    initMatrixRain()
  }
})

// CSS animations for floating particles and ripple
const style = document.createElement("style")
style.textContent = `
    @keyframes float {
        0% { transform: translateY(100vh) rotate(0deg); }
        100% { transform: translateY(-100vh) rotate(360deg); }
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .reveal {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .reveal.revealed {
        opacity: 1;
        transform: translateY(0);
    }
`
document.head.appendChild(style)
