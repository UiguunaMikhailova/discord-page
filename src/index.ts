import "./styles/style.css";
import data from "./data.json";
import { User, Canal, Group } from "./lib/types";
import addListeners from "./scripts/listeners";

// const menuConfigsBtn = document.getElementById("menu-button");
// const menuConfigsIcon = document.getElementById("menu-icon");
// const menuConfigs = document.getElementById("menu");
// const menuConfigsItems = document.querySelectorAll("#menu__item");
const serverList = document.getElementById("server__list");
const canals = document.getElementById("canals");
const serverTitle = document.getElementById("server__title");
const canalTitle = document.getElementById("canal__title");
const online = document.getElementById("online");
const offline = document.getElementById("offline");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
// const modal = document.getElementById("modal");
// const modalBtn = document.getElementById("modal__close");
// const modalOpeners = document.querySelectorAll("#modal__btn");
// const modalBox = document.getElementById("modal__box");
// const aside = document.getElementById("aside");

// let currCanal = {
//   server: 2,
//   group: 2,
//   canal: 0,
// };
localStorage.setItem("canal", "0");
localStorage.setItem("group", "0");
localStorage.setItem("server", "2");
let canal = Number(localStorage.getItem('canal')) || 0;
let group = Number(localStorage.getItem('group')) || 0;
let server = Number(localStorage.getItem('server')) || 2;

showPage();
addListeners();

function showPage(): void {
  if (serverList) {
    while (serverList.firstChild) {
      serverList.removeChild(serverList.firstChild);
    }
  }
  data.forEach((item) => {
    renderServer(item.icon, item.title, item.id);
  });
  renderCanal();
}

function renderServer(icon: string, title: string, index: number): void {
  const currServer = server;
  const serverElement = document.createElement("li");
  const classes = `relative flex flex-col items-center cursor-pointer server ${
    currServer === index ? "server--active" : ""
  }`;
  serverElement.className = classes;
  serverElement.addEventListener("click", () => {
    localStorage.setItem("server", `${index}`);
    localStorage.setItem("group", '0');
    localStorage.setItem("canal", '0');
    server = index;
    canal = 0;
    group = 0;
    showPage();
  });
  serverElement.innerHTML = `<div class="bg-color-gray-400 overflow-hidden w-12 h-12 server__icon flex justify-center">
    <img class="object-contain" src="${icon}" />
    <div class="server__text z-10 absolute left-16 top-2 px-3 py-1 rounded-md text-sm justify-center bg-color-gray-500">${title}</div></div>`;
  serverList?.append(serverElement);
  renderGroups(data[currServer].groups, data[currServer].title);
  const onlineUsers = data[currServer].users.filter((x) => x.online);
  const offlineUsers = data[currServer].users.filter((x) => !x.online);
  renderUsers(onlineUsers, true);
  renderUsers(offlineUsers, false);
}

function renderUsers(users: User[], isOnline: boolean): void {
  const statusElement = document.createElement("p");
  statusElement.className = "w-52 text-sm mb-3 cursor-default";
  statusElement.innerText = `${isOnline ? "В" : "Не в"} сети - ${users.length}`;
  const usersList = document.createElement("ul");
  usersList.className = "flex flex-col gap-2";
  users.forEach((user) => {
    const userElement = document.createElement("li");
    userElement.className = `flex p-1 rounded-md hover:bg-color-gray-300 hover:opacity-100 group cursor-pointer items-center gap-4 relative ${
      isOnline ? "" : "opacity-70"
    }`;
    userElement.innerHTML = `<img class="rounded-full w-8 h-8" src="${
      user.avatar
    }">
    <p class="w-full text-color-gray-200 group-hover:text-color-white ${
      isOnline ? "online" : ""
    }">${user.username}</p>`;
    usersList.appendChild(userElement);
  });
  if (online && offline) {
    if (isOnline) {
      while (online.firstChild) {
        online.removeChild(online.firstChild);
      }
      online.append(statusElement, usersList);
    } else {
      while (offline.firstChild) {
        offline.removeChild(offline.firstChild);
      }
      offline.append(statusElement, usersList);
    }
  }
}

function renderGroups(groups: Group[], title: string): void {
  (serverTitle as HTMLElement).innerHTML = title;
  if (canals) {
    while (canals.firstChild) {
      canals.removeChild(canals.firstChild);
    }
  }
  groups.forEach((group, index) => {
    const groupIndex = index;
    const groupElement = document.createElement("li");
    groupElement.innerHTML = `<p class="text-xs mb-2 hover:text-color-gray-100 cursor-pointer flex items-center gap-1">
    <svg id="arrow" xmlns="http://www.w3.org/2000/svg" fill="none" width="0" height="0" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3 arrow">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    ${group.title.toUpperCase()}
</p>`;
    groupElement.addEventListener("click", (e) => {
      let elem;
      const t = e.target as HTMLElement;
      if (t.nodeName === "svg") {
        elem = t;
      } else if (t.nodeName === "path") {
        elem = t.parentElement;
      } else {
        elem = t.children[0];
      }
      if (elem?.nodeName === "svg") {
        if (elem.classList.contains("rotate")) {
          elem.classList.remove("rotate");
          renderCanals(group.canals, groupIndex, canalList, group.type, true);
        } else {
          elem.classList.add("rotate");
          renderCanals(group.canals, groupIndex, canalList, group.type, false);
        }
      }
    });
    const canalList = document.createElement("ul");
    canalList.className = "flex flex-col gap-1";
    groupElement.appendChild(canalList);
    renderCanals(group.canals, groupIndex, canalList, group.type, true);
    canals?.append(groupElement);
  });
}

function renderCanals(
  canals: Canal[],
  groupIndex: number,
  canalList: HTMLElement,
  groupType: string,
  isVisible: boolean
): void {
  const currCanal = canal;
  const currGroup = group;
  canalList.innerHTML = "";
  if (isVisible) {
    canals.forEach((canal, index) => {
      createCanals(canal, canalList, index, groupIndex, groupType);
    });
  } else {
    const canalData = canals.find(
      (_, index) => currCanal === index && currGroup === groupIndex
    );
    if (canalData) {
      createCanals(canalData, canalList, currCanal, groupIndex, groupType);
    } else {
      group = 0
      canal = 0
      localStorage.setItem('group', '0')
      localStorage.setItem('canal', '0')
      showPage()
    }
  }
}

function createCanals(
  canalData: Canal,
  canalList: HTMLElement,
  index: number,
  groupIndex: number,
  groupType: string
): void {
  const currServer = server;
  const currCanal = canal;
  const currGroup = group;
  const canalElement = document.createElement("li");
  canalElement.addEventListener("click", () => {
    localStorage.setItem("canal", `${index}`);
    localStorage.setItem("group", `${groupIndex}`);
    canal = index;
    group = groupIndex;
    renderGroups(data[currServer].groups, data[currServer].title);
    renderCanal();
  });
  const classes = `rounded hover:bg-color-gray-300 hover:text-color-gray-100 p-2 flex cursor-pointer items-center gap-2 ${
    currCanal === index && currGroup === groupIndex
      ? "canal--active"
      : ""
  }`;
  if (currCanal === index && currGroup === groupIndex) {
    (
      canalTitle as HTMLElement
    ).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="1" height="1" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
    </svg><p>${canalData.title}</p>`;
    (input as HTMLInputElement).placeholder = `Написать #${canalData.title}`;
  }
  canalElement.className = classes;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="1" height="1" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
  </svg>`;
  if (groupType === "voice") {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="1" height="1" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
    <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
  </svg>
  `;
  }
  canalElement.innerHTML = `${svg}<p>${canalData.title}</p>`;
  canalList.appendChild(canalElement);
}

function renderCanal(): void {
  const currServer = server;
  const currCanal = canal;
  const currGroup = group;
  if (messages) {
    while (messages.firstChild) {
      messages.removeChild(messages.firstChild);
    }
  }
  const serverData = data.find((server) => server.id === currServer);
  const groupData = serverData?.groups.find((group) => group.id === currGroup);
  if (!groupData) {
    group = 0
    localStorage.setItem('group', '0')
    return showPage()
  }
  const canalData = groupData?.canals.find((canal) => canal.id === currCanal);
  if (!canalData) {
    canal = 0
    localStorage.setItem('canal', '0')
    return showPage()
  }
  const messageList = document.createElement("ul");
  messageList.className = "flex flex-col-reverse gap-3 my-3 overflow-y-auto";
   canalData?.messages.reverse().forEach((message) => {
    const user = serverData?.users.find((x) => x.id === message.userId);
    const messageElement = document.createElement("li");
    messageElement.className = "flex hover:bg-color-gray-400 px-4 py-2";
    messageElement.innerHTML = `<img class="w-10 h-10 mr-4" src="${user?.avatar}"/>
    <div>
      <p class="mr-2">${user?.username}<span class="text-xs ml-3 font-light text-color-gray-200">${message.date}</span></p>
      <p class="text-sm font-normal">${message.text}</p>
    </div>`;
    messageList.appendChild(messageElement);
  });
  if (!canalData?.messages.length) {
    const messageElement = document.createElement("div");
    messageElement.className =
      "flex flex-col justify-center items-center gap-5 mb-5";
    messageElement.innerHTML = `
      <p class="text-2xl text-center">Добро пожаловать на сервер</p>
      <p class="">Это начало истории этого канала.</p>`;
    messageList.appendChild(messageElement);
  }
  if (messages) {
    messages.appendChild(messageList);
    messages.scrollTop = messages.scrollHeight;
  }
}

// function toggleMenu(): void {
//   if (menuConfigs?.classList.contains("open")) {
//     menuConfigs?.classList.remove("open");
//     (
//       menuConfigsIcon as HTMLElement
//     ).innerHTML = `<svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//     <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
// </svg>
//   `;
//   } else {
//     menuConfigs?.classList.add("open");
//     (
//       menuConfigsIcon as HTMLElement
//     ).innerHTML = `<svg class="-mr-1 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
//     <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
//   </svg>`;
//   }
// }

// function openModal(): void {
//   modal?.classList.add("active");
// }

// menuConfigsBtn?.addEventListener("click", (e) => {
//   e.stopPropagation();
//   toggleMenu();
// });

// menuConfigsItems.forEach((item) => {
//   item.addEventListener("click", (e) => {
//     e.stopPropagation();
//     toggleMenu();
//     openModal();
//   });
// });

// modalOpeners.forEach((item) => {
//   item.addEventListener("click", (e) => {
//     e.stopPropagation();
//     openModal();
//   });
// });

// window.addEventListener("click", (e) => {
//   e.stopPropagation();
//   const target = e.target as HTMLElement;
//   if (
//     menuConfigs?.classList.contains("open") &&
//     target !== menuConfigsBtn &&
//     target !== menuConfigsIcon
//   ) {
//     toggleMenu();
//   }
//   if (modal?.classList.contains("active")) {
//     modal.classList.remove("active");
//   }
// });

// modalBox?.addEventListener("click", (e) => e.stopPropagation());
// modalBtn?.addEventListener("click", (e) => {
//   e.stopPropagation();
//   modal?.classList.remove("active");
// });

// aside?.addEventListener("click", (e) => {
//   e.stopPropagation();
// });

// input?.addEventListener("keyup", (e) => {
//   if (e.key === "Enter") {
//     (input as HTMLInputElement).value = "";
//   }
// });

// window.onload = function (): void {
//   document.body.classList.add("loaded_hiding");
//   window.setTimeout(function () {
//     document.body.classList.add("loaded");
//     document.body.classList.remove("loaded_hiding");
//   }, 2000);
// };
