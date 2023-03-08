/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import "./styles/style.css";
import data from "./data.json";

const menuBtn = document.getElementById("menu-button");
const menuIcon = document.getElementById("menu-icon") as HTMLElement;
const menu = document.getElementById("menu");
const menuList = document.getElementById("menu__list") as HTMLElement;
const canals = document.getElementById("canals") as HTMLElement;
const serverTitle = document.getElementById("server__title") as HTMLElement;
const canalTitle = document.getElementById("canal__title") as HTMLElement;
const online = document.getElementById("online") as HTMLElement;
const offline = document.getElementById("offline") as HTMLElement;
const input = document.getElementById("input") as HTMLInputElement;

type Canal = {
  title: string;
};
type Group = {
  title: string;
  canals: Canal[];
};
type User = {
  id: number;
  username: string;
  avatar: string;
  online: boolean;
};

let currServer = 2;
let currCanal = {
  group: 2,
  canal: 0,
};

showPage();

function showPage(): void {
  currCanal.canal = 0;
  currCanal.group = 0;
  while (menuList.firstChild) {
    menuList.removeChild(menuList.firstChild);
  }
  data.forEach((item) => {
    createServer(item.icon, item.title, item.id);
  });
}

function createServer(icon: string, title: string, index: number): void {
  const li = document.createElement("li");
  const classes = `relative flex flex-col items-center cursor-pointer server ${
    currServer === index ? "server--active" : ""
  }`;
  li.className = classes;
  li.addEventListener("click", () => {
    currServer = index;
    showPage();
  });
  li.innerHTML = `<div class="bg-color-gray-400 overflow-hidden w-12 h-12 rounded-full group hover:rounded-2xl flex justify-center">
    <img class="object-contain rounded-full group-hover:rounded-2xl" src="${icon}" />
    <div class="hidden z-10 group-hover:flex absolute left-16 top-2 px-3 py-1 rounded-md text-sm justify-center bg-color-gray-500">${title}</div></div>`;
  menuList?.append(li);
  createGroups(data[currServer].groups, data[currServer].title);
  const onlineUsers = data[currServer].users.filter((x) => x.online);
  const offlineUsers = data[currServer].users.filter((x) => !x.online);
  renderUsers(onlineUsers, true);
  renderUsers(offlineUsers, false);
}

function renderUsers(users: User[], isOnline: boolean): void {
  const p = document.createElement("p");
  p.className = "w-52 text-sm mb-3 cursor-default";
  p.innerText = `${isOnline ? 'В' : 'Не в'} сети - ${users.length}`;
  const ul = document.createElement("ul");
  ul.className = "flex flex-col gap-2";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.className = `flex p-1 rounded-md hover:bg-color-gray-300 hover:opacity-100 group cursor-pointer items-center gap-4 relative ${isOnline ? '' : 'opacity-70'}`;
    li.innerHTML = `<img class="rounded-full w-8 h-8" src="${user.avatar}">
    <p class="w-full text-color-gray-200 group-hover:text-color-white ${isOnline ? 'online' : ''}">${user.username}</p>`;
    ul.appendChild(li);
  });
  if (isOnline) {
    while (online.firstChild) {
      online.removeChild(online.firstChild);
    }
    online.append(p, ul);
  } else {
    while (offline.firstChild) {
      offline.removeChild(offline.firstChild);
    }
    offline.append(p, ul)
  }
}

function createGroups(groups: Group[], title: string): void {
  serverTitle.innerHTML = title;
  while (canals.firstChild) {
    canals.removeChild(canals.firstChild);
  }
  groups.forEach((group, index) => {
    const groupIndex = index;
    const li = document.createElement("li");
    li.innerHTML = `<p class="text-xs mb-2 hover:text-color-gray-100 cursor-pointer flex items-center gap-1">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="0" height="0" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    ${group.title.toUpperCase()}
</p>`;
    const ul = document.createElement("ul");
    ul.className = "flex flex-col gap-1";
    li.appendChild(ul);
    renderCanals(group.canals, groupIndex, ul);
    canals?.append(li);
  });
}

function renderCanals(
  canals: Canal[],
  groupIndex: number,
  ul: HTMLElement
): void {
  canals.forEach((canal, index) => {
    createCanals(canal, ul, index, groupIndex);
  });
}

function createCanals(
  canal: Canal,
  ul: HTMLElement,
  index: number,
  groupIndex: number
): void {
  const li = document.createElement("li");
  li.addEventListener("click", () => {
    currCanal = {
      canal: index,
      group: groupIndex,
    };
    createGroups(data[currServer].groups, data[currServer].title);
  });
  const classes = `rounded hover:bg-color-gray-300 hover:text-color-gray-100 p-2 flex cursor-pointer items-center gap-2 ${
    currCanal.canal === index && currCanal.group === groupIndex
      ? "canal--active"
      : ""
  }`;
  if (currCanal.canal === index && currCanal.group === groupIndex) {
    canalTitle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="1" height="1" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
    </svg><p>${canal.title}</p>`;
    input.placeholder = `Написать #${canal.title}` 
  }
  li.className = classes;
  li.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="1" height="1" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
  </svg><p>${canal.title}</p>`;
  ul.appendChild(li);
}

menuBtn?.addEventListener("click", () => {
  if (menu?.classList.contains("hidden")) {
    menu?.classList.remove("hidden");
    menu?.classList.add("flex");
    menuIcon.innerHTML = `<svg class="-mr-1 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
  `;
  } else {
    menu?.classList.add("hidden");
    menu?.classList.remove("flex");
    menuIcon.innerHTML = `<svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
    </svg>`;
  }
});
