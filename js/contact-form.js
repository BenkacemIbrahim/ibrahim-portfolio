// Contact form specific functionality
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm")
  if (!contactForm) return

  // Add placeholder text that will show when labels are hidden
  document.getElementById("name").setAttribute("placeholder", "IDENTIFICATION")
  document.getElementById("email").setAttribute("placeholder", "COMMUNICATION CHANNEL")
  document.getElementById("subject").setAttribute("placeholder", "TRANSMISSION SUBJECT")
  document.getElementById("message").setAttribute("placeholder", "TRANSMISSION CONTENT")

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

  // Real-time validation
  function validateField(input, errorElement, validationFn) {
    input.addEventListener("blur", () => {
      const error = validationFn(input.value.trim())
      if (error) {
        errorElement.textContent = error
        errorElement.classList.remove("hidden")
        input.classList.add("border-red-500")
      } else {
        errorElement.classList.add("hidden")
        input.classList.remove("border-red-500")
        input.classList.add("border-green-500")
      }
    })

    input.addEventListener("input", () => {
      if (!errorElement.classList.contains("hidden")) {
        const error = validationFn(input.value.trim())
        if (!error) {
          errorElement.classList.add("hidden")
          input.classList.remove("border-red-500")
          input.classList.add("border-green-500")
        }
      }
    })
  }

  // Validation functions
  const validateName = (value) => {
    if (!value) return "Please enter your name"
    if (value.length < 2) return "Name must be at least 2 characters"
    return null
  }

  const validateEmail = (value) => {
    if (!value) return "Please enter your email"
    if (!emailRegex.test(value)) return "Please enter a valid email address"
    return null
  }

  const validateSubject = (value) => {
    if (!value) return "Please enter a subject"
    if (value.length < 5) return "Subject must be at least 5 characters"
    return null
  }

  const validateMessage = (value) => {
    if (!value) return "Please enter your message"
    if (value.length < 10) return "Message must be at least 10 characters"
    return null
  }

  // Set up real-time validation
  validateField(nameInput, nameError, validateName)
  validateField(emailInput, emailError, validateEmail)
  validateField(subjectInput, subjectError, validateSubject)
  validateField(messageInput, messageError, validateMessage)

  // Form submission
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Reset all errors
    const errorElements = [nameError, emailError, subjectError, messageError]
    errorElements.forEach((error) => error.classList.add("hidden"))

    // Validate all fields
    const nameErr = validateName(nameInput.value.trim())
    const emailErr = validateEmail(emailInput.value.trim())
    const subjectErr = validateSubject(subjectInput.value.trim())
    const messageErr = validateMessage(messageInput.value.trim())

    let isValid = true

    if (nameErr) {
      nameError.textContent = nameErr
      nameError.classList.remove("hidden")
      isValid = false
    }

    if (emailErr) {
      emailError.textContent = emailErr
      emailError.classList.remove("hidden")
      isValid = false
    }

    if (subjectErr) {
      subjectError.textContent = subjectErr
      subjectError.classList.remove("hidden")
      isValid = false
    }

    if (messageErr) {
      messageError.textContent = messageErr
      messageError.classList.remove("hidden")
      isValid = false
    }

    if (isValid) {
      // Show loading state
      submitBtn.disabled = true
      const submitText = document.getElementById("submitText")
      const originalText = submitText.innerHTML
      submitText.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> TRANSMITTING...'

      try {
        // Simulate form submission (replace with actual form submission)
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Show success message
        formMessage.classList.remove("hidden", "bg-red-500/20")
        formMessage.classList.add("bg-green-500/20")
        formMessage.innerHTML = `
                    <div class="flex items-center">
                        <i class="fas fa-check-circle text-green-500 mr-2"></i>
                        <div>
                            <strong>Transmission Successful!</strong><br>
                            Your message has been received. I'll get back to you within 24 hours.
                        </div>
                    </div>
                `

        // Reset form
        contactForm.reset()

        // Remove validation classes
        const inputs = [nameInput, emailInput, subjectInput, messageInput]
        inputs.forEach((input) => {
          input.classList.remove("border-green-500", "border-red-500")
        })

        // Hide success message after 8 seconds
        setTimeout(() => {
          formMessage.classList.add("hidden")
        }, 8000)
      } catch (error) {
        // Show error message
        formMessage.classList.remove("hidden", "bg-green-500/20")
        formMessage.classList.add("bg-red-500/20")
        formMessage.innerHTML = `
                    <div class="flex items-center">
                        <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
                        <div>
                            <strong>Transmission Failed!</strong><br>
                            There was an error sending your message. Please try again.
                        </div>
                    </div>
                `

        // Hide error message after 5 seconds
        setTimeout(() => {
          formMessage.classList.add("hidden")
        }, 5000)
      } finally {
        // Reset button
        submitBtn.disabled = false
        submitText.innerHTML = originalText
      }
    }
  })

  // Character counter for message field
  const messageCounter = document.createElement("div")
  messageCounter.className = "text-xs text-gray-400 mt-1"
  messageInput.parentNode.appendChild(messageCounter)

  messageInput.addEventListener("input", () => {
    const length = messageInput.value.length
    const maxLength = 1000
    messageCounter.textContent = `${length}/${maxLength} characters`

    if (length > maxLength * 0.9) {
      messageCounter.classList.add("text-yellow-400")
    } else {
      messageCounter.classList.remove("text-yellow-400")
    }
  })

  // Auto-resize textarea
  messageInput.addEventListener("input", () => {
    messageInput.style.height = "auto"
    messageInput.style.height = messageInput.scrollHeight + "px"
  })
})
