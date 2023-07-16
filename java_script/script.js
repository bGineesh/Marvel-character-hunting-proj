// Taking an tag attributes values for initializing the the methods
const input = document.querySelector('.input');
const button = document.querySelector('.button')
const show = document.querySelector('.show');
const list = document.querySelector('.list')
const openChar = document.querySelector('.open-profile');


// these are the md5 value to fetch the data from the url
let ts = "1";
let publicKey = "34589897480223a143e3be84f8dc6894";
let hashKey = "efae92628e296a07dd0e16941c2b1dda";

// md5 values are stored in an array form
const [timestamp, apiKey, hashValue] = [ts, publicKey, hashKey];

// const charsData = [];

// function localStorage() {
//   localStorage.setItem("charsData", JSON.stringify(charsData));
//   handler();
// }

// this is for the value getting from the value that put on the input filed 
function displayWords(value) {
  input.value = value;
  // after putting the value int the field then after we are clearing the list from appearing
  charList();
}

//  it is clearing the field before rendering the data
function charList() {
  list.innerHTML = "";
}

// listener for input filed when we enter any key on it.
input.addEventListener("keyup", async () => {
  // initializing the function for the input filed
  charList();

  if (input.value.trim().length < 3) {
    return false;
  }

  // this the url that we are fetch the data to uss in web page
  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&nameStartsWith=${input.value}`;

  // we are storing a data from the link after fetching it
  const respond = await fetch(url);
  // it is storing in json formate
  const jData = await respond.json();

  // we are going throw data into result filed and getting the name value for the list value to display the name value
  jData.data["results"].forEach((element) => {
    let name = element.name;
    let li = document.createElement("div");
    li.style.cursor = "pointer";
    li.classList.add('list_items');
    li.setAttribute('onclick', "displayWords('" + name + "')");
    let word = "<b>" + name.substr(0, input.value.length) + "</b>";
    word += name.substr(input.value.length);
    li.innerHTML = `<p class="items">${word}</p>`;
    list.appendChild(li);
  });

});

button.addEventListener('click', async () => {
  if (input.value === 0) {
    alert("Nothing there!")
  }

})

handler = async () => {
  if (input.value.trim().length < 1) {
    alert("Nothing there")
  }

  show.innerHTML = "";

  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}`;

  const respond = await fetch(url);
  const jData = await respond.json();

  jData.data["results"].forEach((element) => {
    const article = document.createElement("article");
    if (input.value == element.name) {
      let name = element.name;
      let li = document.createElement("div");
      li.style.cursor = "pointer";
      li.classList.add('img-container');
      // li.setAttribute('onclick', "displayWords('" + name + "')");
      let word = "<b>" + name.substr(0, input.value.length) + "</b>";
      word += name.substr(input.value.length);
      li.innerHTML = `
      <div class="img-container"><img id="image" src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]}" alt ="${element.name}" class="grid-items">
      <button class="open-profile" value="${element.name}" onClick='openChar(${element.name})'>Open</button>
      <button class="add-to-favorite" onClick='addFav()'>favorite</button>
      </div>
      <div class="name grid-items">
      ${element.name}
      </div>
      `;
      list.appendChild(li);
    }
    else {
      article.innerHTML = `<div class="img-container"><img id="image" src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]}" alt ="${element.name}" class="grid-items">
      <button class="open-profile" value="${element.name}" onClick='openChar(${element.name})'>Open</button>
      <button class="add-to-favorite" onClick='addFav()'>favorite</button>
      </div>
      <div class="name grid-items">
      ${element.name}
      </div>`;
    }

    // localStorage();
    show.appendChild(article);
  });

};

handler();