const input = document.querySelector('.input');
const button = document.querySelector('.button')

const show = document.querySelector('.show');
const list = document.querySelector('.list')

let ts = "1";
let publicKey = "34589897480223a143e3be84f8dc6894";
let hashKey = "efae92628e296a07dd0e16941c2b1dda";

const [timestamp, apiKey, hashValue] = [ts, publicKey, hashKey];

function displayWords(value) {
  input.value = value;
  charList();
}

function charList() {
  list.innerHTML = "";
}

input.addEventListener("keyup", async () => {
  charList();
  if (input.value.trim().length < 4) {
    return false;
  }

  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&nameStartsWith=${input.value}`;

  const respond = await fetch(url);
  const jData = await respond.json();

  jData.data["results"].forEach((element) => {
    let name = element.name;
    let li = document.createElement("div");
    li.style.cursor = "pointer";
    li.classList.add('list_items');
    li.setAttribute('onclick', "displayWords('" + name + "')");
    let word = "<b>" + name.substr(0, input.value.length) + "</b>";
    word += name.substr(input.value.length);
    li.innerHTML = `<p class="items">${word}</p>`;
    list.appendChild(li)
  });

});

// button.addEventListener('click', async () => {
//   if (input.value) {

//   }
// })


handler = async () => {
  if (input.value.trim().length < 1) {
    alert("nothing there")
  }

  show.innerHTML = "";

  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}`;

  const respond = await fetch(url);
  const jData = await respond.json();

  jData.data["results"].forEach((element) => {
    const article = document.createElement("article");
    article.innerHTML = `<div class="img-container"><img id="image" src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]}" alt ="" class="grid-items">
    <span class="open-profile">Open</span>
    <p class="add-to-favorite">favorite</p>
    </div>
    <div class="name grid-items">
      ${element.name}
    </div>`;
    show.appendChild(article);
  });

};

handler();