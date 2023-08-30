// Taking an tag attributes values for initializing the the methods
const input = document.querySelector('.input');
const button = document.querySelector('.button')
const show = document.querySelector('.show');
const list = document.querySelector('.list');


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
let favoriteListNames = [];
let favList = [];
var homeData = "";
var searchData = "";
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
  appData = [];
  appData = [...data];
  console.log(appData)
  window.localStorage.setItem("Data", JSON.stringify(appData));

  let hmData = JSON.parse(window.localStorage.getItem("Data"));
  console.log("html data: ", hmData);
  hmData.forEach((element) => {
    // Home data created
    homeData += `<article>
<div class="img-container">
  <a href="${element.urls[0].url}" target="_blank">
  <img class="image" src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]}" alt ="${element.name}" class="grid-items">
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
    appData = [];
    appData.push(dataValue[0]);
    console.log(appData);
    window.localStorage.setItem("Data", JSON.stringify(appData));
    let srData = JSON.parse(window.localStorage.getItem("Data"));
    srData.forEach((element) => {
      // Home data created
      searchData = `<article>
  <div class="img-container">
    <a href="${element.urls[0].url}" target="_blank">
    <img class="image" src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]}" alt ="${element.name}" class="grid-items">
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
    <div class="details">A
    <a href="${element.urls[2] ? element.urls[2].url : "..."}" target="_blank"> <p class="comic">Comics:<span>${element.comics["available"]}</span></p></a>
    <a href="${element.urls[0].url}" target="_blank"><p class="more-details">More details</p></a>
  </div>
    <button class="fav">add to fav
    <i class="fa fa-plus" aria-hidden="true"></i>
    </button>
  </div>
  </article>`;
    });
    pages["home"] = searchData;
    show.innerHTML = pages["home"];
  };

  show.addEventListener("click", function (e) {
    if (e.target.classList.contains("fav")) {
      const parent = e.target.parentNode.querySelector(".name");
      const characterName = parent.innerText;
      if (!characterName) {
        alert("No character to add to favorites!");
        return;
      }

      if (favoriteListNames.includes(characterName)) {
        alert("Character already in favorites!");
        return;
      }
      alert("Character added to favorites!");
      favoriteListNames.push(characterName);

      alert(`${characterName} added to favorites!`);
      appData.forEach((element) => {
        if (element.name == characterName) {
          favList.push(element);
        }
      });
      window.localStorage.setItem("favData", JSON.stringify(favList));
      console.log("Favorite list ", favList);
      pages["fav"] = updateFavoriteContent();
      handler();
    }
    else if (e.target.classList.contains("unFav")) {
      console.log(e.target);
      const parent = e.target.parentNode.querySelector("#name");
      console.log(parent);
      const characterName = parent.innerText;
      console.log(characterName);
      let favData = JSON.parse(window.localStorage.getItem("favData"));
      favData.forEach((element) => {
        const index = favData.findIndex(item => item.name === characterName);
        if (index !== -1) {
          favData.splice(index, 1);
        }
      });
      window.localStorage.setItem("favData", JSON.stringify(favData));
      console.log("Favorite list ", favData);
      pages["fav"] = updateFavoriteContent();
      handler();
    }

  });

  // fav data creation
  function updateFavoriteContent() {
    let favoriteData = "";
    let favData = JSON.parse(window.localStorage.getItem("favData"));

    if (favData !== null) {
      favData.forEach((element) => {
        favoriteData += `<article>
    <div class="img-container"><a href="${element.urls[0].url}" target="_blank"><img class="image" src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]}" alt ="${element.name}" class="grid-items"></a>
    <h3  class="grid-items" id="name">${element.name}</h3>
    <p class="series">Series: <span>${element.series["available"]}</p>
    <p class="stories">Stories: <span>${element.stories["available"]}</p>
    <div class="details">
    <a href="${element.urls[2] ? element.urls[2].url : "..."}" target="_blank"> <p class="comic">Comics:<span>${element.comics["available"]}</span></p></a>
    <a href="${element.urls[0].url}" target="_blank"><p class="more-details">More details</p></a>
    </div>
    <button class="unFav">Del fav<i class="fa fa-trash" aria-hidden="true"></i></button>
    </div>
    </article>`;
      });
      pages["fav"] = favoriteData;
    }
    return favoriteData;
  }

  handler();
};

// added hash eventlistener to route between pages
window.addEventListener("hashchange", handler);

handler();

function handler() {
  var sliceVal = location.hash.slice(1);
  if (sliceVal === "home") {
    show.innerHTML = pages[sliceVal];
  }
  else {
    show.innerHTML = pages[sliceVal]
  }
}