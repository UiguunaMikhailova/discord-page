import "./styles/style.css";
import data from "./data.json";

console.log(data);

const menuBtn = document.getElementById("menu-button");
const menuIcon = document.getElementById("menu-icon") as HTMLElement;
const menu = document.getElementById("menu");
const menuList = document.getElementById("menu__list");
data.forEach((item) => {
  const li = document.createElement("li");
  li.className = "relative flex flex-col items-center group cursor-pointer";
  li.innerHTML = `<div class="bg-color-gray-400 overflow-hidden w-12 h-12 rounded-full group-hover:rounded-2xl flex justify-center">
    <img class="object-contain rounded-full group-hover:rounded-2xl" src="${item.icon}" />
 </div>
 <div class="opacity-0 transition-opacity duration-300 group-hover:opacity-100 absolute left-16 top-2 px-3 py-1 rounded-md text-sm flex justify-center bg-color-gray-500">${item.title}</div>
`;
  menuList?.append(li);
});
menuBtn?.addEventListener("click", () => {
  if (menu?.classList.contains("hidden")) {
    menu?.classList.remove("hidden");
    menuIcon.innerHTML = `<svg class="-mr-1 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
  `;
  } else {
    menu?.classList.add("hidden");
    menuIcon.innerHTML = `<svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
    </svg>`;
  }
});
