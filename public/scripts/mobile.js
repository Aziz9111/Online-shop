const mobileBtnElement = document.querySelector(".mobile-btn");
const mobileMenueElement = document.querySelector(".mobile-menu");

function handleMobileMenu() {
  mobileMenueElement.classList.toggle("open");
}

mobileBtnElement.addEventListener("click", handleMobileMenu);
