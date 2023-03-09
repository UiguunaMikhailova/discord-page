/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import "./styles/style.css";
import data from "./data.json";

const menuConfigsBtn = document.getElementById("menu-button");
const menuConfigsIcon = document.getElementById("menu-icon") as HTMLElement;
const menuConfigs = document.getElementById("menu");
const menuConfigsItems = document.querySelectorAll("#menu__item");
const serverList = document.getElementById("server__list") as HTMLElement;
const canals = document.getElementById("canals") as HTMLElement;
const serverTitle = document.getElementById("server__title") as HTMLElement;
const canalTitle = document.getElementById("canal__title") as HTMLElement;
const online = document.getElementById("online") as HTMLElement;
const offline = document.getElementById("offline") as HTMLElement;
const input = document.getElementById("input") as HTMLInputElement;
const messages = document.getElementById("messages") as HTMLInputElement;

type Message = {
  userId: number;
  text: string;
  date: string;
};
type Canal = {
  id: number;
  title: string;
  messages: Message[];
};
type Group = {
  id: number;
  title: string;
  type: string;
  canals: Canal[];
};
type Server = {
  id: number;
  title: string;
  icon: string;
  users: User[];
  groups: Group[];
}
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
  while (serverList.firstChild) {
    serverList.removeChild(serverList.firstChild);
  }
  data.forEach((item) => {
    renderServer(item.icon, item.title, item.id);
  });
  renderCanal();
}

function renderServer(icon: string, title: string, index: number): void {
  const serverElement = document.createElement("li");
  const classes = `relative flex flex-col items-center cursor-pointer server ${
    currServer === index ? "server--active" : ""
  }`;
  serverElement.className = classes;
  serverElement.addEventListener("click", () => {
    currServer = index;
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
    userElement.innerHTML = `<img class="rounded-full w-8 h-8" src="${user.avatar}">
    <p class="w-full text-color-gray-200 group-hover:text-color-white ${
      isOnline ? "online" : ""
    }">${user.username}</p>`;
    usersList.appendChild(userElement);
  });
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

function renderGroups(groups: Group[], title: string): void {
  serverTitle.innerHTML = title;
  while (canals.firstChild) {
    canals.removeChild(canals.firstChild);
  }
  groups.forEach((group, index) => {
    const groupIndex = index;
    const groupElement = document.createElement("li");
    groupElement.addEventListener('click', (e) => {
      const elem = (e.target as HTMLElement).children[0]
      if (elem.classList.contains('-rotate-90')) {
        elem.classList.remove('-rotate-90')
        renderCanals(group.canals, groupIndex, canalList, group.type, true);
      } else {
        elem.classList.add('-rotate-90')
        renderCanals(group.canals, groupIndex, canalList, group.type, false);
      }
    })
    groupElement.innerHTML = `<p class="text-xs mb-2 hover:text-color-gray-100 cursor-pointer flex items-center gap-1">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="0" height="0" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    ${group.title.toUpperCase()}
</p>`;
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
  canalList.innerHTML = ''
  if (isVisible) {
    canals.forEach((canal, index) => {
    createCanals(canal, canalList, index, groupIndex, groupType);
  });
  } else {
    const canal = canals.find((canal, index) => currCanal.canal === index && currCanal.group === groupIndex)
    if (canal) {
      createCanals(canal, canalList, currCanal.canal, groupIndex, groupType);
    }
  }
}

function createCanals(
  canal: Canal,
  canalList: HTMLElement,
  index: number,
  groupIndex: number,
  groupType: string
): void {
  const canalElement = document.createElement("li");
  canalElement.addEventListener("click", () => {
    currCanal = {
      canal: index,
      group: groupIndex,
    };
    renderGroups(data[currServer].groups, data[currServer].title);
    renderCanal();
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
    input.placeholder = `Написать #${canal.title}`;
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
  canalElement.innerHTML = `${svg}<p>${canal.title}</p>`;
  canalList.appendChild(canalElement);
}

function renderCanal(): void {
  while (messages.firstChild) {
    messages.removeChild(messages.firstChild);
  }
  const server = data.find((server) => server.id === currServer);
  const group = server?.groups.find((group) => group.id === currCanal.group);
  const canal = group?.canals.find((canal) => canal.id === currCanal.canal);
  const messageList = document.createElement('ul')
  messageList.className = 'flex flex-col-reverse gap-3 my-3 overflow-y-auto';
  canal?.messages.forEach((message) => {
    const user = server?.users.find((x) => x.id === message.userId)
    const messageElement = document.createElement('li')
    messageElement.className = 'flex hover:bg-color-gray-400 px-4 py-2'
    messageElement.innerHTML = `<img class="w-10 h-10 mr-4" src="${user?.avatar}"/>
    <div>
      <p class="mr-2">${user?.username}<span class="text-xs ml-3 font-light text-color-gray-200">${message.date}</span></p>
      <p class="text-sm font-normal">${message.text}</p>
    </div>`
    messageList.appendChild(messageElement)
  })
  if (!canal?.messages.length) {
    const messageElement = document.createElement('div')
    messageElement.className = 'flex flex-col justify-center items-center gap-5 mb-5'
    messageElement.innerHTML = `
      <p class="text-2xl text-center">Добро пожаловать на сервер</p>
      <p class="">Это начало истории этого канала.</p>`
    messageList.appendChild(messageElement)
  }
  messages.appendChild(messageList);
}

menuConfigsBtn?.addEventListener("click", () => {
  if (menuConfigs?.classList.contains("hidden")) {
    menuConfigs?.classList.remove("hidden");
    menuConfigs?.classList.add("flex");
    menuConfigsIcon.innerHTML = `<svg class="-mr-1 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
  `;
  } else {
    menuConfigs?.classList.add("hidden");
    menuConfigs?.classList.remove("flex");
    menuConfigsIcon.innerHTML = `<svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
    </svg>`;
  }
});
menuConfigsItems.forEach((item) => {
  item.addEventListener('click', () => {
    menuConfigs?.classList.add("hidden");
    menuConfigs?.classList.remove("flex");
    menuConfigsIcon.innerHTML = `<svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
    </svg>`;
  })
})
