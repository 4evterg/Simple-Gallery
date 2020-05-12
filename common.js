let currentItem = 0;
let nextItem = 1;
let prevItem = -1;
// Пути к списку пользователей и папки с их изображениями
const user_decrip = "users.txt";
const images_url = "images/";
// Задержка между слайдами при автовоспроизведении
let autoplay_delay = 4000;

let previewbox = document.getElementById("preview");
let previews = previewbox.getElementsByTagName("div");
// Сколько фоток в нижней карусели мы хотим.
// Точнее сколько блоков, т.к. фоток всеравно будет видно только столько
// сколько влезет на экран
let pre_size = 7;

function init() {
  preview.init();
  carousel();
}

// Автовоспроизведение
let autoPlay = setInterval(() => {
  carousel("next");
}, autoplay_delay);
function resetAP() {
  clearInterval(autoPlay);
  autoPlay = setInterval(() => {
    carousel("next");
  }, autoplay_delay);
}

// Привязка стрелочек к карусели
document.onkeyup = checkKey;
function checkKey(e) {
  e = e || window.event;

  if (e.keyCode == "37") {
    carousel("prev");
  } else if (e.keyCode == "39") {
    carousel("next");
  }
}

function carousel(direction) {
  let item = document.getElementById("current-item");
  let prev_item = document.getElementById("prev");
  let next_item = document.getElementById("next");

  let desc_box = document.getElementById('flat-desc');
  let name = desc_box.getElementsByTagName("h1");
  let desc = desc_box.getElementsByTagName("p");

  let users = user(0)[2];

  if (direction == "next") {
    currentItem++;
    nextItem++;
    prevItem++;
    preview.right();
    resetAP();
  } else if (direction == "prev") {
    currentItem--;
    nextItem--;
    prevItem--;
    preview.left();
    resetAP();
  }
  if (currentItem < 0) {
    // На случай если мы на нулевом слайде и щелкнули "предыдущий"
    // или на последнем пользователе и жмакнули следующий.
    // Вычитаем единицу, чтобы получить индекс последнего юзера
    currentItem += users;
  }
  if (currentItem >= users) {
    currentItem = 0;
  }
  if (nextItem == users) {
    nextItem = 0;
  }
  if (nextItem < 0) {
    nextItem += users;
  }
  if (prevItem == users) {
    prevItem = 0;
  }
  if (prevItem < 0) {
    prevItem += users;
  }
  let img_path = images_url + currentItem + ".jpg";
  let prev_path = images_url + prevItem + ".jpg";
  let next_path = images_url + nextItem + ".jpg";

  //setPreview(currentItem);
  item.style.background = "url('" + img_path + "')";
  item.style.backgroundSize = "cover";
  name[0].innerHTML = user(currentItem)[0];
  desc[0].innerHTML = user(currentItem)[1];

  prev_item.style.backgroundImage = "url('" + prev_path + "')";
  next_item.style.backgroundImage = "url('" + next_path + "')";
}

// Получение юзеров
function user(id) {
  let result = null;
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", user_decrip, false);

  xmlhttp.send();

  result = xmlhttp.responseText;

  let arr = result.split("\n");
  id *= 2;

  //  (arr.length / 2) - кол-во юзеров
  return [arr[id], arr[id + 1], arr.length / 2];
}

// function jumpTo(index) {
//   let direction = "next";

//   console.log(index);
//   currentItem = index;
//   nextItem = index + 1;
//   prevItem = index - 1;
//   carousel(direction);
// }

// Нижняя карусель
let preview = {
  elem: [],
  // риал лефт и райт нужны для корректного отображения фоток
  // т.к. реально элементов всего "pre_size", а кол-во пользователей
  // может быть больше
  real_left: 0,
  real_right: 0,
  current: 0,
  init: function() {
    for (let i = 0; i <= pre_size; i++) {
      this.elem[i] = document.createElement("div");
    }

    for (let i = 0; i <= pre_size - 4; i++) {
      this.right();
    }
    this.current = 0;
    this.real_left = user(0)[2] - 1;
    for (let i = 0; i < 3; i++) {
      this.left();
      this.real_right++;
    }
  },
  right: function(cur_user = this.current) {
    this.current++;
    this.real_left++;
    if (this.real_right >= user(0)[2]) {
      this.real_right = 0;
    }
    if (this.real_left >= user(0)[2]) {
      this.real_left = 0;
    }
    if (this.current >= pre_size) {
      this.current = 0;
    }
    let img_path = images_url + this.real_right++ + ".jpg";
    this.elem[this.current].style.backgroundImage = "url('" + img_path + "')";
    previewbox.appendChild(this.elem[this.current]);
  },
  left: function() {
    this.real_right--;
    if (this.real_right < 0) {
      this.real_right = user(0)[2] - 1;
    }
    if (this.real_left < 0) {
      this.real_left = user(0)[2] - 1;
    }
    if (this.current < 0) {
      this.current = pre_size - 1;
    }
    let img_path = images_url + this.real_left-- + ".jpg";
    this.elem[this.current].style.backgroundImage = "url('" + img_path + "')";
    previewbox.prepend(this.elem[this.current]);
    this.current--;
  }
};
