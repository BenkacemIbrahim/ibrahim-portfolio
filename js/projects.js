// Projects page specific functionality
document.addEventListener("DOMContentLoaded", () => {
  // Enhanced project filtering with animations
  const filterButtons = document.querySelectorAll(".filter-btn")
  const projectCards = document.querySelectorAll(".project-card")

  if (filterButtons.length === 0 || projectCards.length === 0) return

  // Initialize filter state
  let currentFilter = "all"

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterValue = button.getAttribute("data-filter")

      if (filterValue === currentFilter) return

      // Update button states
      filterButtons.forEach((btn) => {
        btn.setAttribute("aria-selected", "false")
        btn.classList.remove("bg-primary-600")
        btn.classList.add("bg-gray-900/30")
      })

      button.setAttribute("aria-selected", "true")
      button.classList.remove("bg-gray-900/30")
      button.classList.add("bg-primary-600")

      // Filter projects with staggered animation
      filterProjects(filterValue)
      currentFilter = filterValue
    })
  })

  function filterProjects(filterValue) {
    projectCards.forEach((card, index) => {
      const category = card.getAttribute("data-category")
      const shouldShow = filterValue === "all" || category === filterValue

      if (shouldShow) {
        // Show card with staggered animation
        setTimeout(() => {
          card.style.display = "block"
          card.style.opacity = "0"
          card.style.transform = "translateY(20px)"

          setTimeout(() => {
            card.style.transition = "opacity 0.3s ease, transform 0.3s ease"
            card.style.opacity = "1"
            card.style.transform = "translateY(0)"
          }, 10)
        }, index * 100)
      } else {
        // Hide card
        card.style.transition = "opacity 0.3s ease, transform 0.3s ease"
        card.style.opacity = "0"
        card.style.transform = "translateY(-20px)"

        setTimeout(() => {
          card.style.display = "none"
        }, 300)
      }
    })
  }

  // Project card hover effects
  projectCards.forEach((card) => {
    const image = card.querySelector("img")
    const title = card.querySelector("h3")

    card.addEventListener("mouseenter", () => {
      if (image) {
        image.style.transform = "scale(1.1)"
      }
      if (title) {
        title.classList.add("text-primary-400")
      }
    })

    card.addEventListener("mouseleave", () => {
      if (image) {
        image.style.transform = "scale(1)"
      }
      if (title) {
        title.classList.remove("text-primary-400")
      }
    })
  })

  // Lazy load project images
  const projectImages = document.querySelectorAll(".project-card img[data-src]")

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

    projectImages.forEach((img) => {
      imageObserver.observe(img)
    })
  }

  // Project search functionality
  const searchInput = document.createElement("input")
  searchInput.type = "text"
  searchInput.placeholder = "Search projects..."
  searchInput.className =
    "w-full max-w-md mx-auto mb-8 px-4 py-2 bg-gray-800/50 border border-primary-500/30 rounded-lg text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none"

  const filterContainer = document.querySelector(".flex.flex-wrap.justify-center.mb-12")
  if (filterContainer) {
    const searchContainer = document.createElement("div")
    searchContainer.className = "w-full flex justify-center mb-6"
    searchContainer.appendChild(searchInput)
    filterContainer.parentNode.insertBefore(searchContainer, filterContainer)
  }

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase()

    projectCards.forEach((card) => {
      const title = card.querySelector("h3").textContent.toLowerCase()
      const description = card.querySelector("p").textContent.toLowerCase()
      const tags = Array.from(card.querySelectorAll("span")).map((span) => span.textContent.toLowerCase())

      const matches =
        title.includes(searchTerm) || description.includes(searchTerm) || tags.some((tag) => tag.includes(searchTerm))

      if (matches) {
        card.style.display = "block"
        card.style.opacity = "1"
      } else {
        card.style.opacity = "0.3"
      }
    })
  })

  // Project statistics animation
  const statCounters = document.querySelectorAll(".counter")

  const animateCounter = (counter) => {
    const target = Number.parseInt(counter.getAttribute("data-target"))
    const duration = 2000
    const step = target / (duration / 16)
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
  }

  // Intersection Observer for counters
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target)
            counterObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 },
    )

    statCounters.forEach((counter) => {
      counterObserver.observe(counter)
    })
  }
})
