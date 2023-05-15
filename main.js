import "./style.css";

const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");

const apiUrl = "https://api.lyrics.ovh";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchValue = search.value.trim();

  if (!searchValue) {
    alert("There is nothing to search.");
  } else {
    searchSong(searchValue);
  }
});

async function searchSong(searchValue) {
  try {
    const searchResult = await fetch(`${apiUrl}/suggest/${searchValue}`);
    const data = await searchResult.json();
    showData(data);
  } catch (error) {
    console.log(error);
  }
}

function showData(data) {
  result.innerHTML = `
    <ul class="song-list">
      ${data.data
        .map(
          (song) => `
          <li>
            <div>
              <img src="${song.artist.picture}" alt="Artist name" />
              <strong>${song.artist.name}</strong>
            </div>
            <span data-artist="${song.artist.name}" data-songtitle="${song.title}">Get lyrics</span>
          </li>
        `
        )
        .join("")}
    </ul>
  `;
}

result.addEventListener("click", (e) => {
  const clickElement = e.target;

  if (clickElement.tagName === "SPAN") {
    const artist = clickElement.getAttribute("data-artist");
    const songTitle = clickElement.getAttribute("data-songtitle");

    getLyrics(artist, songTitle);
  }
});

async function getLyrics(artist, songTitle) {
  const url = "https://api.lyrics.ovh/v1/";

  try {
    const res = await fetch(`${url}${artist}/${songTitle}`);
    const data = await res.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

    result.innerHTML = `
      <div class="full-lyrics">
        <h2>${artist} - ${songTitle}</h2>
        <p>${lyrics}</p>
      </div>
    `;
  } catch (error) {
    console.log(error);
  }
}
