document.addEventListener("DOMContentLoaded", () => {
  // Animate skill bars on scroll
  const skillCards = document.querySelectorAll(".skill-card")

  if (skillCards.length === 0) return

  const options = {
    threshold: 0.2,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBar = entry.target.querySelector(".progress-bar")
        if (progressBar) {
          // Get the target width from the inline style
          const targetWidth = progressBar.style.width

          // Reset width to 0 for animation
          progressBar.style.width = "0%"
          progressBar.style.transition = "width 1.5s ease-in-out"

          // Trigger animation after a small delay
          setTimeout(() => {
            progressBar.style.width = targetWidth
          }, 100)
        }

        // Add animation to the skill card
        entry.target.style.opacity = "0"
        entry.target.style.transform = "translateY(20px)"
        entry.target.style.transition = "opacity 0.5s ease, transform 0.5s ease"

        setTimeout(() => {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }, 100)

        observer.unobserve(entry.target)
      }
    })
  }, options)

  skillCards.forEach((card) => {
    observer.observe(card)
  })

  // Skill category tabs (if implemented)
  const skillCategories = document.querySelectorAll(".skill-category-tab")
  const skillSections = document.querySelectorAll(".skill-section")

  if (skillCategories.length > 0 && skillSections.length > 0) {
    skillCategories.forEach((tab) => {
      tab.addEventListener("click", () => {
        const category = tab.getAttribute("data-category")

        // Update active tab
        skillCategories.forEach((t) => {
          t.classList.remove("bg-primary-600", "text-white")
          t.classList.add("bg-gray-800", "text-gray-300")
        })

        tab.classList.remove("bg-gray-800", "text-gray-300")
        tab.classList.add("bg-primary-600", "text-white")

        // Show/hide sections
        skillSections.forEach((section) => {
          if (section.getAttribute("data-category") === category || category === "all") {
            section.style.display = "block"
            setTimeout(() => {
              section.style.opacity = "1"
              section.style.transform = "translateY(0)"
            }, 50)
          } else {
            section.style.opacity = "0"
            section.style.transform = "translateY(20px)"
            setTimeout(() => {
              section.style.display = "none"
            }, 300)
          }
        })
      })
    })
  }

  // Skill hover effects
  skillCards.forEach((card) => {
    const skillIcon = card.querySelector(".skill-icon")

    card.addEventListener("mouseenter", () => {
      if (skillIcon) {
        skillIcon.style.transform = "scale(1.2) rotate(10deg)"
        skillIcon.style.transition = "transform 0.3s ease"
      }

      card.style.transform = "translateY(-5px) scale(1.02)"
      card.style.boxShadow = "0 10px 30px rgba(59, 130, 246, 0.3)"
    })

    card.addEventListener("mouseleave", () => {
      if (skillIcon) {
        skillIcon.style.transform = "scale(1) rotate(0deg)"
      }

      card.style.transform = "translateY(0) scale(1)"
      card.style.boxShadow = ""
    })
  })

  // Skill proficiency animation
  const proficiencyBars = document.querySelectorAll(".progress-bar")

  proficiencyBars.forEach((bar) => {
    bar.addEventListener("animationend", () => {
      // Add a subtle pulse effect after the bar animation completes
      bar.style.animation = "pulse 2s infinite"
    })
  })
})

// Skills page specific functionality
document.addEventListener("DOMContentLoaded", () => {
  // Animate skill progress bars
  const skillCards = document.querySelectorAll(".skill-card")

  if ("IntersectionObserver" in window) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const progressBar = entry.target.querySelector(".progress-bar")
            if (progressBar) {
              const width = progressBar.style.width
              progressBar.style.width = "0%"
              progressBar.style.transition = "width 1.5s ease-in-out"

              setTimeout(() => {
                progressBar.style.width = width
              }, 200)
            }

            skillObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 },
    )

    skillCards.forEach((card) => {
      skillObserver.observe(card)
    })
  }

  // Skill card hover effects
  skillCards.forEach((card) => {
    const icon = card.querySelector(".skill-icon")
    const progressBar = card.querySelector(".progress-bar")

    card.addEventListener("mouseenter", () => {
      if (icon) {
        icon.style.transform = "scale(1.2) rotate(5deg)"
      }
      if (progressBar) {
        progressBar.style.boxShadow = "0 0 15px rgba(59, 130, 246, 0.6)"
      }
    })

    card.addEventListener("mouseleave", () => {
      if (icon) {
        icon.style.transform = "scale(1) rotate(0deg)"
      }
      if (progressBar) {
        progressBar.style.boxShadow = "none"
      }
    })
  })

  // Skills filter functionality
  const skillSections = document.querySelectorAll(".mb-16")
  const filterButtons = document.createElement("div")
  filterButtons.className = "flex flex-wrap justify-center mb-12 space-x-2 space-y-2 md:space-y-0"
  filterButtons.innerHTML = `
        <button class="skill-filter-btn px-6 py-2 rounded-full bg-primary-600 border border-primary-500 hover:border-primary-400 transition-all duration-300" data-filter="all">
            All Skills
        </button>
        <button class="skill-filter-btn px-6 py-2 rounded-full bg-gray-900/30 border border-blue-500 hover:border-blue-400 transition-all duration-300" data-filter="frontend">
            Frontend
        </button>
        <button class="skill-filter-btn px-6 py-2 rounded-full bg-gray-900/30 border border-blue-500 hover:border-blue-400 transition-all duration-300" data-filter="backend">
            Backend
        </button>
        <button class="skill-filter-btn px-6 py-2 rounded-full bg-gray-900/30 border border-blue-500 hover:border-blue-400 transition-all duration-300" data-filter="devops">
            DevOps
        </button>
        <button class="skill-filter-btn px-6 py-2 rounded-full bg-gray-900/30 border border-blue-500 hover:border-blue-400 transition-all duration-300" data-filter="design">
            Design
        </button>
    `

  const skillsContainer = document.querySelector("#skills .container")
  if (skillsContainer) {
    const title = skillsContainer.querySelector("h1")
    title.parentNode.insertBefore(filterButtons, title.nextSibling)
  }

  // Filter functionality
  const skillFilterButtons = document.querySelectorAll(".skill-filter-btn")

  skillFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterValue = button.getAttribute("data-filter")

      // Update button states
      skillFilterButtons.forEach((btn) => {
        btn.classList.remove("bg-primary-600")
        btn.classList.add("bg-gray-900/30")
      })

      button.classList.remove("bg-gray-900/30")
      button.classList.add("bg-primary-600")

      // Filter sections
      skillSections.forEach((section) => {
        const sectionTitle = section.querySelector("h2")
        if (!sectionTitle) return

        const sectionType = getSectionType(sectionTitle.textContent)

        if (filterValue === "all" || sectionType === filterValue) {
          section.style.display = "block"
          section.style.opacity = "0"
          setTimeout(() => {
            section.style.transition = "opacity 0.5s ease"
            section.style.opacity = "1"
          }, 10)
        } else {
          section.style.transition = "opacity 0.3s ease"
          section.style.opacity = "0"
          setTimeout(() => {
            section.style.display = "none"
          }, 300)
        }
      })
    })
  })

  function getSectionType(title) {
    const titleLower = title.toLowerCase()
    if (titleLower.includes("frontend")) return "frontend"
    if (titleLower.includes("backend")) return "backend"
    if (titleLower.includes("devops")) return "devops"
    if (titleLower.includes("design")) return "design"
    return "other"
  }

  // Skill comparison feature
  let selectedSkills = []

  skillCards.forEach((card) => {
    const skillName = card.querySelector("h3").textContent
    const progressBar = card.querySelector(".progress-bar")
    const percentage = progressBar ? progressBar.getAttribute("aria-valuenow") : 0

    card.addEventListener("click", () => {
      if (selectedSkills.find((skill) => skill.name === skillName)) {
        // Remove from selection
        selectedSkills = selectedSkills.filter((skill) => skill.name !== skillName)
        card.classList.remove("ring-2", "ring-primary-400")
      } else if (selectedSkills.length < 3) {
        // Add to selection (max 3)
        selectedSkills.push({ name: skillName, percentage: Number.parseInt(percentage) })
        card.classList.add("ring-2", "ring-primary-400")
      }

      updateComparisonDisplay()
    })
  })

  function updateComparisonDisplay() {
    let comparisonDiv = document.getElementById("skill-comparison")

    if (selectedSkills.length === 0) {
      if (comparisonDiv) {
        comparisonDiv.remove()
      }
      return
    }

    if (!comparisonDiv) {
      comparisonDiv = document.createElement("div")
      comparisonDiv.id = "skill-comparison"
      comparisonDiv.className =
        "fixed bottom-4 right-4 bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg border border-primary-500/30 max-w-sm"
      document.body.appendChild(comparisonDiv)
    }

    comparisonDiv.innerHTML = `
            <h4 class="text-lg font-semibold mb-2 text-primary-400">Skill Comparison</h4>
            ${selectedSkills
              .map(
                (skill) => `
                <div class="flex justify-between items-center mb-1">
                    <span class="text-sm">${skill.name}</span>
                    <span class="text-sm font-semibold">${skill.percentage}%</span>
                </div>
            `,
              )
              .join("")}
            <button onclick="document.getElementById('skill-comparison').remove(); document.querySelectorAll('.skill-card').forEach(card => card.classList.remove('ring-2', 'ring-primary-400')); selectedSkills = []" 
                    class="mt-2 text-xs text-gray-400 hover:text-white">
                Clear Selection
            </button>
        `
  }
})
