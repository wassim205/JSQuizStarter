export function createEl(tagName, properties = {}, children = []) {
  const element = document.createElement(tagName)

  Object.entries(properties).forEach(([key, value]) => {
    if (key === "class") {
      element.className = value
    } else if (key === "text") {
      element.textContent = value
    } else if (key === "html") {
      element.innerHTML = value
    } else {
      element.setAttribute(key, value)
    }
  })

  children.forEach((child) => element.appendChild(child))

  return element
}

export function formatSeconds(milliseconds) {
  if (milliseconds == null) return ""
  return (milliseconds / 1000).toFixed(3) + "s"
}

export function safeNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}
