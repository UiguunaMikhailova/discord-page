const menuConfigsBtn = document.getElementById("menu-button");
const menuConfigsIcon = document.getElementById("menu-icon");
const menuConfigs = document.getElementById("menu");
const menuConfigsItems = document.querySelectorAll("#menu__item");
const modal = document.getElementById("modal");
const modalBtn = document.getElementById("modal__close");
const modalOpeners = document.querySelectorAll("#modal__btn");
const modalBox = document.getElementById("modal__box");
const aside = document.getElementById("aside");
const input = document.getElementById("input");

function toggleMenu(): void {
  if (menuConfigs?.classList.contains("open")) {
    menuConfigs?.classList.remove("open");
    (
      menuConfigsIcon as HTMLElement
    ).innerHTML = `<svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
  </svg>
    `;
  } else {
    menuConfigs?.classList.add("open");
    (
      menuConfigsIcon as HTMLElement
    ).innerHTML = `<svg class="-mr-1 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>`;
  }
}

function openModal(): void {
  modal?.classList.add("active");
}

function addListeners(): void {
  menuConfigsBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });
  menuConfigsItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
      openModal();
    });
  });
  modalOpeners.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      openModal();
    });
  });
  window.addEventListener("click", (e) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (
      menuConfigs?.classList.contains("open") &&
      target !== menuConfigsBtn &&
      target !== menuConfigsIcon
    ) {
      toggleMenu();
    }
    if (modal?.classList.contains("active")) {
      modal.classList.remove("active");
    }
  });
  modalBox?.addEventListener("click", (e) => e.stopPropagation());
  modalBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    modal?.classList.remove("active");
  });
  aside?.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  input?.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      (input as HTMLInputElement).value = "";
    }
  });
  window.onload = function (): void {
    document.body.classList.add("loaded_hiding");
    window.setTimeout(function () {
      document.body.classList.add("loaded");
      document.body.classList.remove("loaded_hiding");
    }, 2000);
  };
}

export default addListeners;