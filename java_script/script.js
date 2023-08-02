// Taking an tag attributes values for initializing the the methods
const input = document.querySelector('.input');
const button = document.querySelector('.button')
var show = document.querySelector('.show');
const list = document.querySelector('.list')
// const openChar = document.querySelector('.open-profile');


// these are the md5 value to fetch the data from the url
let ts = "1";
let publicKey = "34589897480223a143e3be84f8dc6894";
let hashKey = "efae92628e296a07dd0e16941c2b1dda";

// md5 values are stored in an array form
const [timestamp, apiKey, hashValue] = [ts, publicKey, hashKey];

const pages = {
  home: ``,
  fav: `<p style="text-align:center; font-size:1.1rem;">Your favorite is empty</p>`,
};

let appData = [];
let favoriteList = [];
var homeData = "";
let favoriteData = "";

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

if (!location.hash) {
  location.hash = "#home";
}

// display the data in home from api and in the favorite
window.onload = async () => {
  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}`;

  const respond = await fetch(url);
  const jData = await respond.json();
  const data = jData.data.results;
  appData = [...data];
  console.log(appData)
  window.localStorage.setItem("Data", JSON.stringify(appData));
  let hmData = JSON.parse(window.localStorage.getItem("Data"));
  console.log(hmData);
  hmData.forEach((element) => {
    // Home data created
    homeData += `<article>
    <div class="img-container">
      <a href="${element.urls[0].url}" target="_blank">
      <img id="image" src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]}" alt ="${element.name}" class="grid-items">
      </a>
      <h3  class="name grid-items">
        ${element.name}
      </h3>
      <p class="series">
      Series: <span>${element.series["available"]}
      </p>
      <p class="stories">
      Stories: <span>${element.stories["available"]}
      </p>
      <div class="details">
      <a href="${element.urls[2] ? element.urls[2].url : "..."}" target="_blank"> <p class="comic">Comics:<span>${element.comics["available"]}</span></p></a>
      <a href="${element.urls[0].url}" target="_blank"><p class="more-details">More details</p></a>
    </div>
      <button class="fav">add to fav
      <i class="fa fa-plus" aria-hidden="true"></i>
      </button>
    </div>
    </article>`;
  });

  pages["home"] = homeData;

  button.onclick = async () => {
    if (input.value.trim() === "") {
      alert("Nothing there!")
      return;
    }
    // this the url that we are fetch the data to uss in web page
    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&name=${input.value}`;

    // we are storing a data from the link after fetching it
    const respond = await fetch(url);
    // it is storing in json formate
    const jData = await respond.json();
    const dataValue = jData.data.results;
    if (dataValue.length === 0) {
      // If no character found with the provided name, show an alert and return early
      alert("No character found with the given name!");
      return;
    }

    appData.push(dataValue[0]);
    window.localStorage.setItem("Data", JSON.stringify(appData));
  };

  // favButton.onclick = async () => {
  //   const characterName = show.querySelector(".name")?.innerText;
  //   if (!characterName) {
  //     alert("No character to add to favorites!");
  //     return;
  //   }

  //   if (favoriteList.includes(characterName)) {
  //     alert("Character already in favorites!");
  //     return;
  //   }

  //   favoriteList.push(characterName);
  //   window.localStorage.setItem("favData", JSON.stringify(favoriteList));

  //   alert(`${characterName} added to favorites!`);

  //   // favoriteData = "";
  //   // if (favoriteData === 0) {
  //   //   appData.forEach((element) => {
  //   //     console.log(element.id);
  //   //     favoriteList.push(element.name);
  //   //   });
  //   // }
  //   // window.localStorage.setItem("favData", JSON.stringify(favoriteList));
  // };

  const favButton = document.querySelectorAll(".fav");
  favButton.forEach((button) => {
    button.addEventListener("click", async () => {
      const characterName = button.closest(".img-container").querySelector("#name").innerText;
      if (!characterName) {
        alert("No character to add to favorites!");
        return;
      }

      if (favoriteList.includes(characterName)) {
        alert("Character already in favorites!");
        return;
      }

      favoriteList.push(characterName);
      window.localStorage.setItem("favData", JSON.stringify(favoriteList));

      alert(`${characterName} added to favorites!`);
    });
  });

  // fav data creation
  let favData = JSON.parse(window.localStorage.getItem("favData"));
  if (favData !== null) {
    favoriteList = favData;
    data.forEach((element) => {
      for (let item of favoriteList) {
        console.log(item);
        if (element.name === item) {
          favoriteData += `<article>
      <div class="img-container"><a href="${element.urls[0].url}" target="_blank"><img class="image" src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]}" alt ="${element.name}" class="grid-items"></a>
    <h3  class="grid-items" id="name">
      ${element.name}
    </h3>
    <p class="series">Series: <span>${element.series["available"]}</p>
    <p class="stories">Stories: <span>${element.stories["available"]}</p>
    <div class="details">
      <a href="${element.urls[2] ? element.urls[2].url : "..."}" target="_blank"> <p class="comic">Comics:<span>${element.comics["available"]}</span></p></a>
      <a href="${element.urls[0].url}" target="_blank"><p class="more-details">More details</p></a>
    </div>
    <button class="unFav">Del fav<i class="fa fa-trash" aria-hidden="true"></i></button>
    </div>
    </article>`;
        }
      }
    });
    pages["fav"] = favoriteData;
  }

  handler();
};

// added hash eventlistener to route between pages
window.addEventListener("hashchange", handler);

handler();

function handler() {
  var sliceVal = location.hash.slice(1);
  if (sliceVal === "fav") {
    show.innerHTML = pages[sliceVal];
    const unFavButtons = document.querySelectorAll(".unFav");
    unFavButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const characterName = button.closest(".img-container").querySelector("#name").innerText;
        const index = favoriteList.indexOf(characterName);
        if (index !== -1) {
          favoriteList.splice(index, 1);
          window.localStorage.setItem("favData", JSON.stringify(favoriteList));
          window.location.reload();
        };
      })
    })
  }
  else {
    show.innerHTML = pages[sliceVal]
  }
}