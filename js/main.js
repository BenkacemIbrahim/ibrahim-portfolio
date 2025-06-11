// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS (Animate on Scroll)
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    delay: 100,
    easing: "ease-in-out",
  })

  // Initialize Vanta.js background with error handling
  if (typeof VANTA !== "undefined") {
    VANTA.NET({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x3b82f6,
      backgroundColor: 0x111827,
      points: 10.0,
      maxDistance: 25.0,
      spacing: 17.0,
    })
  } else {
    console.warn("VANTA.js not loaded")
  }

  // Initialize Particles.js with error handling
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: { value: 100, density: { enable: true, value_area: 800 } },
        color: { value: "#3b82f6" },
        shape: {
          type: "circle",
          stroke: { width: 0, color: "#000000" },
          polygon: { nb_sides: 5 },
        },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#3b82f6", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 6, direction: "none", random: false, straight: false },
      },
    })
  } else {
    console.warn("Particles.js not loaded")
  }

  // Mobile menu toggle
  const mobileMenuButton = document.getElementById("mobileMenuButton")
  const mobileMenu = document.getElementById("mobileMenu")

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
      const isExpanded = mobileMenuButton.getAttribute("aria-expanded") === "true"
      mobileMenuButton.setAttribute("aria-expanded", !isExpanded)
    })
  }

  // Typed.js initialization (only on home page)
  const typedElement = document.getElementById("typed-text")
  if (typedElement && typeof Typed !== "undefined") {
    const typed = new Typed("#typed-text", {
      strings: ["Web Developer", "UI/UX Designer", "Tech Enthusiast", "Problem Solver"],
      typeSpeed: 50,
      backSpeed: 50,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    })
  }

  // Scroll event listener for header background color change
  const header = document.getElementById("main-header")
  let lastScrollY = window.scrollY

  function updateHeaderBackground() {
    const scrollY = window.scrollY
    const scrollDirection = scrollY > lastScrollY ? "down" : "up"

    if (scrollY > 50) {
      // Scrolling down and past the threshold
      header.classList.add("bg-gray-900", "bg-opacity-90")
      header.classList.remove("bg-transparent")
    } else {
      // At the top or scrolling up past the threshold
      header.classList.remove("bg-gray-900", "bg-opacity-90")
      header.classList.add("bg-transparent")
    }

    lastScrollY = scrollY
  }

  window.addEventListener("scroll", updateHeaderBackground)
  updateHeaderBackground() // Initial call

  // Three.js setup
  setupThreeJS()

  // Star trail animation
  setupStarTrails()

  // Create holographic elements
  createHolographicElements()

  // Loading screen
  setupLoadingScreen()

  // HUD updates
  setupHUD()

  // Project filtering (only on projects page)
  setupProjectFilters()

  // Counter animation (for stats)
  setupCounters()

  // Form validation (only on contact page)
  setupContactForm()

  // Lazy loading images
  setupLazyLoading()
})

// Three.js setup
function setupThreeJS() {
  const canvas = document.getElementById("threejs-canvas")
  if (!canvas) return

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Limit for performance

  // Create multiple geometric objects
  const objects = []
  const particlesCount = 1000

  // Create particle system
  const particlesGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
  }
  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.8,
  })

  const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particleSystem)

  // Create multiple cubes with glowing edges
  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    const edges = new THREE.EdgesGeometry(geometry)
    const material = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.8,
    })

    const cube = new THREE.LineSegments(edges, material)
    cube.position.x = (Math.random() - 0.5) * 5
    cube.position.y = (Math.random() - 0.5) * 5
    cube.position.z = (Math.random() - 0.5) * 5

    objects.push(cube)
    scene.add(cube)
  }

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)

  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0x3b82f6, 1)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  // Add point lights
  const pointLight1 = new THREE.PointLight(0x3b82f6, 1, 10)
  pointLight1.position.set(2, 2, 2)
  scene.add(pointLight1)

  const pointLight2 = new THREE.PointLight(0x00ff00, 1, 10)
  pointLight2.position.set(-2, -2, -2)
  scene.add(pointLight2)

  // Set camera position
  camera.position.z = 3

  // Animation loop
  function animate() {
    requestAnimationFrame(animate)

    // Rotate particle system
    particleSystem.rotation.x += 0.001
    particleSystem.rotation.y += 0.001

    // Animate cubes
    objects.forEach((cube, index) => {
      cube.rotation.x += 0.01 * (index + 1)
      cube.rotation.y += 0.01 * (index + 1)

      // Make cubes pulse
      const scale = 1 + Math.sin(Date.now() * 0.001 + index) * 0.2
      cube.scale.set(scale, scale, scale)
    })

    // Move camera in a circular pattern
    camera.position.x = Math.sin(Date.now() * 0.001) * 3
    camera.position.z = Math.cos(Date.now() * 0.001) * 3 + 3
    camera.lookAt(scene.position)

    renderer.render(scene, camera)
  }
  animate()

  // Resize event listener
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
}

// Star trail animation
function setupStarTrails() {
  const starTrailCanvas = document.getElementById("star-trail-canvas")
  if (!starTrailCanvas) return

  const starTrailCtx = starTrailCanvas.getContext("2d")
  starTrailCanvas.width = window.innerWidth
  starTrailCanvas.height = window.innerHeight

  const stars = []
  const numStars = 100

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * starTrailCanvas.width,
      y: Math.random() * starTrailCanvas.height,
      vx: Math.random() * 0.5 - 0.25,
      vy: Math.random() * 0.5 - 0.25,
      radius: Math.random() * 2 + 1,
      color: `hsla(${210 + Math.random() * 20}, 100%, 50%, 0.5)`, // Shades of blue
    })
  }

  function animateStarTrails() {
    requestAnimationFrame(animateStarTrails)

    starTrailCtx.clearRect(0, 0, starTrailCanvas.width, starTrailCanvas.height)

    stars.forEach((star) => {
      star.x += star.vx
      star.y += star.vy

      if (star.x < 0 || star.x > starTrailCanvas.width) {
        star.vx *= -1
      }
      if (star.y < 0 || star.y > starTrailCanvas.height) {
        star.vy *= -1
      }

      starTrailCtx.fillStyle = star.color
      starTrailCtx.beginPath()
      starTrailCtx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI)
      starTrailCtx.fill()
    })
  }
  animateStarTrails()

  // Resize event listener
  window.addEventListener("resize", () => {
    starTrailCanvas.width = window.innerWidth
    starTrailCanvas.height = window.innerHeight
  })
}

// Create holographic elements
function createHolographicElements() {
  const container = document.getElementById("holographic-container")
  if (!container) return

  const numElements = 5

  for (let i = 0; i < numElements; i++) {
    const element = document.createElement("div")
    element.classList.add("holographic-element")

    // Random position
    element.style.left = `${Math.random() * 100}%`
    element.style.top = `${Math.random() * 100}%`

    // Random size
    const size = 50 + Math.random() * 100
    element.style.width = `${size}px`
    element.style.height = `${size}px`

    // Random rotation speed
    const speed = 5 + Math.random() * 20
    element.style.animation = `rotate3d ${speed}s linear infinite`

    container.appendChild(element)
  }
}

// Loading screen
function setupLoadingScreen() {
  const loadingContainer = document.getElementById("loading-container")
  if (!loadingContainer) return

  function showLoading() {
    loadingContainer.style.display = "flex"
    document.body.classList.add("no-scroll") // Disable scrolling
  }

  function hideLoading() {
    loadingContainer.style.display = "none"
    document.body.classList.remove("no-scroll") // Re-enable scrolling
  }

  function createMultipleLoaders() {
    const numLoaders = 3
    const loaderContainer = document.createElement("div")
    loaderContainer.className = "flex space-x-4"

    for (let i = 0; i < numLoaders; i++) {
      const loader = document.createElement("div")
      loader.className = "holographic-loader"
      loader.style.animationDelay = `${i * 0.2}s`
      loaderContainer.appendChild(loader)
    }

    loadingContainer.innerHTML = ""
    loadingContainer.appendChild(loaderContainer)
  }

  // Call this function to create multiple loaders
  createMultipleLoaders()

  // Simulate loading process
  showLoading()

  // Hide after all content is loaded
  window.addEventListener("load", () => {
    setTimeout(() => {
      hideLoading()
    }, 1000)
  })

  // Fallback in case load event doesn't fire
  setTimeout(() => {
    hideLoading()
  }, 3000)
}

// HUD updates
function setupHUD() {
  const fpsValue = document.getElementById("fps-value")
  const timeValue = document.getElementById("time-value")
  const fpsValueMobile = document.getElementById("fps-value-mobile")
  const timeValueMobile = document.getElementById("time-value-mobile")

  if (!fpsValue && !timeValue && !fpsValueMobile && !timeValueMobile) return

  let lastTime = performance.now()
  let frameCount = 0
  let fps = 60

  // FPS averaging
  const fpsBuffer = []
  const bufferSize = 10 // Number of samples to average

  function updateHUD() {
    const currentTime = performance.now()
    const deltaTime = currentTime - lastTime
    frameCount++

    if (deltaTime >= 1000) {
      // Update FPS
      fps = Math.round((frameCount * 1000) / deltaTime)
      if (fpsValue) fpsValue.textContent = fps

      // Reset
      frameCount = 0
      lastTime = currentTime
    }

    // Update time
    const now = new Date()
    const timeString = now.toTimeString().split(" ")[0]
    if (timeValue) timeValue.textContent = timeString

    // Update mobile HUD if screen is small
    if (window.innerWidth < 768) {
      // Add current FPS to buffer
      fpsBuffer.push(fps)
      if (fpsBuffer.length > bufferSize) {
        fpsBuffer.shift() // Remove oldest entry if buffer is full
      }

      // Calculate average FPS
      const averageFps = Math.round(fpsBuffer.reduce((a, b) => a + b, 0) / fpsBuffer.length)

      // Update FPS display (update every 500ms to reduce flickering)
      if (fpsValueMobile && performance.now() % 500 < 16) {
        fpsValueMobile.textContent = averageFps
      }

      // Update time display
      if (timeValueMobile) timeValueMobile.textContent = timeString
    }

    requestAnimationFrame(updateHUD)
  }

  updateHUD()
}

// Project filtering
function setupProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const projectCards = document.querySelectorAll(".project-card")

  if (filterButtons.length === 0 || projectCards.length === 0) return

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update aria-selected state
      filterButtons.forEach((btn) => {
        btn.setAttribute("aria-selected", "false")
        btn.classList.remove("bg-primary-600")
        btn.classList.add("bg-gray-900/30")
      })

      button.setAttribute("aria-selected", "true")
      button.classList.remove("bg-gray-900/30")
      button.classList.add("bg-primary-600")

      const filterValue = button.getAttribute("data-filter")

      projectCards.forEach((card) => {
        // Show all projects if "all" is selected
        if (filterValue === "all") {
          card.style.display = "block"
          setTimeout(() => {
            card.classList.remove("opacity-0")
            card.classList.add("opacity-100")
          }, 10)
        } else {
          // Show only projects matching the selected category
          if (card.getAttribute("data-category") === filterValue) {
            card.style.display = "block"
            setTimeout(() => {
              card.classList.remove("opacity-0")
              card.classList.add("opacity-100")
            }, 10)
          } else {
            card.classList.remove("opacity-100")
            card.classList.add("opacity-0")
            setTimeout(() => {
              card.style.display = "none"
            }, 300)
          }
        }
      })
    })
  })
}

// Counter animation
function setupCounters() {
  const counters = document.querySelectorAll(".counter")

  if (counters.length === 0) return

  const options = {
    threshold: 0.5,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target
        const target = Number.parseInt(counter.getAttribute("data-target"))
        const duration = 2000 // 2 seconds
        const step = target / (duration / 16) // 16ms per frame (approx 60fps)
        let current = 0

        const updateCounter = () => {
          current += step
          if (current < target) {
            counter.textContent = Math.round(current)
            requestAnimationFrame(updateCounter)
          } else {
            counter.textContent = target
          }
        }

        updateCounter()
        observer.unobserve(counter)
      }
    })
  }, options)

  counters.forEach((counter) => {
    observer.observe(counter)
  })
}

// Contact form validation
function setupContactForm() {
  const contactForm = document.getElementById("contactForm")

  if (!contactForm) return

  const nameInput = document.getElementById("name")
  const emailInput = document.getElementById("email")
  const subjectInput = document.getElementById("subject")
  const messageInput = document.getElementById("message")
  const submitBtn = document.getElementById("submitBtn")
  const formMessage = document.getElementById("form-message")

  const nameError = document.getElementById("name-error")
  const emailError = document.getElementById("email-error")
  const subjectError = document.getElementById("subject-error")
  const messageError = document.getElementById("message-error")

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Form submission
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Reset errors
    nameError.classList.add("hidden")
    emailError.classList.add("hidden")
    subjectError.classList.add("hidden")
    messageError.classList.add("hidden")

    // Validate inputs
    let isValid = true

    if (!nameInput.value.trim()) {
      nameError.textContent = "Please enter your name"
      nameError.classList.remove("hidden")
      isValid = false
    }

    if (!emailInput.value.trim()) {
      emailError.textContent = "Please enter your email"
      emailError.classList.remove("hidden")
      isValid = false
    } else if (!emailRegex.test(emailInput.value.trim())) {
      emailError.textContent = "Please enter a valid email address"
      emailError.classList.remove("hidden")
      isValid = false
    }

    if (!subjectInput.value.trim()) {
      subjectError.textContent = "Please enter a subject"
      subjectError.classList.remove("hidden")
      isValid = false
    }

    if (!messageInput.value.trim()) {
      messageError.textContent = "Please enter your message"
      messageError.classList.remove("hidden")
      isValid = false
    }

    if (isValid) {
      // Show loading state
      submitBtn.disabled = true
      const submitText = document.getElementById("submitText")
      submitText.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> SENDING...'

      // Simulate form submission (replace with actual form submission)
      setTimeout(() => {
        formMessage.classList.remove("hidden", "bg-red-500/20")
        formMessage.classList.add("bg-green-500/20")
        formMessage.innerHTML =
          '<div class="flex items-center"><i class="fas fa-check-circle text-green-500 mr-2"></i> Your message has been sent successfully! I\'ll get back to you soon.</div>'

        // Reset form
        contactForm.reset()

        // Reset button
        submitBtn.disabled = false
        submitText.innerHTML = '<i class="fas fa-paper-plane"></i> INITIATE TRANSMISSION'

        // Hide success message after 5 seconds
        setTimeout(() => {
          formMessage.classList.add("hidden")
        }, 5000)
      }, 1500)
    }
  })
}

// Lazy loading images
function setupLazyLoading() {
  const lazyImages = document.querySelectorAll(".lazy-load")

  if (lazyImages.length === 0) return

  // Use Intersection Observer if available
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          const src = img.getAttribute("data-src")

          if (src) {
            img.src = src
            img.addEventListener("load", () => {
              img.classList.add("loaded")
            })
          }

          imageObserver.unobserve(img)
        }
      })
    })

    lazyImages.forEach((img) => {
      imageObserver.observe(img)
    })
  } else {
    // Fallback for browsers that don't support Intersection Observer
    let lazyLoadThrottleTimeout

    function lazyLoad() {
      if (lazyLoadThrottleTimeout) {
        clearTimeout(lazyLoadThrottleTimeout)
      }

      lazyLoadThrottleTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset

        lazyImages.forEach((img) => {
          if (img.offsetTop < window.innerHeight + scrollTop) {
            const src = img.getAttribute("data-src")

            if (src) {
              img.src = src
              img.addEventListener("load", () => {
                img.classList.add("loaded")
              })
            }
          }
        })

        if (lazyImages.length === 0) {
          document.removeEventListener("scroll", lazyLoad)
          window.removeEventListener("resize", lazyLoad)
          window.removeEventListener("orientationChange", lazyLoad)
        }
      }, 20)
    }

    document.addEventListener("scroll", lazyLoad)
    window.addEventListener("resize", lazyLoad)
    window.addEventListener("orientationChange", lazyLoad)

    // Initial load
    lazyLoad()
  }
}