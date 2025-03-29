---
layout: default
title: Music
permalink: /music/
icon: fas fa-music  
order: 6
---

<h1>Suno Music</h1>

<div id="debug-area"></div>  <div id="music-list"></div>

<!-- <div id="audio-player-container">
  <audio id="audio-player" controls></audio>
</div> -->

<div id="audio-player-container">
  <audio id="audio-player" controls></audio>
  <p>Now Playing: <span id="current-song-title"></span></p>
</div>


<script>
  const debugArea = document.getElementById("debug-area");

  fetch("/assets/mjk/songs.json")
    .then((response) => {
      // debugArea.innerHTML += "<p>Fetch response status: " + response.status + "</p>"; // Check fetch status
      return response.json();
    })
    .then((songs) => {
      // debugArea.innerHTML += "<p>Songs data: " + JSON.stringify(songs) + "</p>"; // Check songs data

      const musicList = document.getElementById("music-list");
      const audioPlayer = document.getElementById("audio-player");
      const currentSongTitle = document.getElementById("current-song-title");

      songs.forEach((song) => {
        // debugArea.innerHTML += "<p>Processing song: " + JSON.stringify(song) + "</p>"; // Check each song

        const songItem = document.createElement("div");
        songItem.classList.add("song-item");

        const image = document.createElement("img");
        image.src = song.image;
        image.classList.add("song-image");
        songItem.appendChild(image);

        const title = document.createElement("span");
        title.textContent = song.title;
        songItem.appendChild(title);

        songItem.addEventListener("click", () => {
          audioPlayer.src = song.url;
          audioPlayer.play();
          currentSongTitle.textContent = song.title;
        });

        musicList.appendChild(songItem);
      });
    })
    .catch((error) => {
      debugArea.innerHTML += "<p>Fetch error: " + error + "</p>"; // Check for fetch errors
    });
</script>
<style>
  #music-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center; /* Center song items horizontally */
  }

  .song-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    margin: 5px;
    cursor: pointer;
    text-align: center;
    width: 200px; /* Set a base width for song items */
  }

  .song-image {
    width: 150px;
    height: 150px;
    margin-bottom: 5px;
  }

  #audio-player-container {
    margin-top: 20px;
    width: 100%; /* Make the player take full width */
  }

  audio {
    width: 100%; /* Make the audio element take full width of its container */
  }

  /* #debug-area {
    border: 1px solid red;
    padding: 10px;
    margin-bottom: 10px;
    font-size: 12px;
  } */

  @media (max-width: 600px) {
    .song-item {
      width: 150px; /* Adjust width for smaller screens */
    }

    .song-image {
      width: 100px; /* Adjust image size for smaller screens */
      height: 100px;
    }
  }
</style>
