// const items = document.querySelectorAll('.album');

// items.forEach(el => {
//     el.addEventListener("click", () => {

//       items.forEach(el => el.classList.remove("select"));

//       el.classList.add("select");
//     });
//   });



// async function  fetchdata(num) {
//   const key = 11711025;
//   const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${key}&format=json&limit=20&audioformat=mp32&include=musicinfo`;

//   let res = await fetch(url);
//   let data = await res.json();

  
//   let artistGroups = {};
//   data.results.forEach(track => {
  
//     let artist = track.artist_name || "Unknown Artist";
 
//     if (!artistGroups[artist]) {
//       artistGroups[artist] = []; 
//     }
  
//     artistGroups[artist].push({
//       id: track.id,
//       name: track.name,
//       artist: track.artist_name,
//       image: track.album_image,
//       audio: track.audio
//     });
//   });
//   let artist = Object.keys(artistGroups);
//   console.log(artistGroups[artist[num-1]]);
//   return artistGroups[artist[num-1]];

// }

// let play_audio=null;


// async function displayData(num) {
//   let musics=await fetchdata(num);
//    console.log(musics);
//   let container = document.querySelector('.musics');
//   let img=[]
//   let artist=[]
//   let audio=[]
//   let name=[]
//   musics.forEach(music => {
//     img.push(music.image);
//     artist.push(music.artist);
//     audio.push(music.audio);
//     name.push(music.name);
//   });
//   // console.log(img);
//   // console.log(artist);
//   // console.log(audio);
//   // console.log(name);
//   container.innerHTML = ""; 
//   for(let i=0; i<img.length; i++) {
//   container.innerHTML += `<div class="song">
//                 <img class="songimg" src="${img[i]}" alt="Song Image">
//                 <div class="songname">${name[i]}</div>
//                 <div class="artist">${artist[i]}</div>
//                 <audio class="audio" preload="auto" src="${audio[i]}"></audio>
//             </div>`
// }

//   let songs=document.querySelectorAll('.song')
//   playmusic(songs);

  
// }


// async function checkData() {
//   const items = document.querySelectorAll('.album');
//   items.forEach((el, index) => {
//     el.addEventListener("click", () => {
//       displayData(index + 1);
//     });
//   });

// }

// checkData();



// function playmusic(songs) {
//  songs.forEach(el => {
//       el.addEventListener("click", async () => {
//         try {
//           if (play_audio) {
//             await play_audio.pause();
//             play_audio.currentTime = 0;
//           }
    
//           const audioEl = el.querySelector("audio");
//           play_audio = audioEl;

//           play_audio.addEventListener("canplaythrough", () => {
//             play_audio.play().catch(err => console.log("Play error:", err));
//           }, { once: true });
    
//           play_audio.load();
//         } catch (err) {
//           console.error("Playback error:", err);
//         }
    
//     });
//   });
  
// }




async function fetchData() {
  const key = 11711025;
  const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${key}&format=json&limit=20&audioformat=mp32&include=musicinfo`;

  let res = await fetch(url);
  let data = await res.json();

  let artistGroups = {};
  data.results.forEach(track => {
    let artist = track.artist_name || "Unknown Artist";
    if (!artistGroups[artist]) {
      artistGroups[artist] = [];
    }
    artistGroups[artist].push({
      id: track.id,
      name: track.name,
      artist: track.artist_name,
      image: track.album_image,
      audio: track.audio
    });
  });

  return artistGroups; 
}

let play_audio = null;
let allArtists = {}; 
let player=new Audio();
let currentTrackIndex = -1;
let loadedSongs = [];




function displaySongs(artistName) {
  let musics = allArtists[artistName];
  let container = document.querySelector('.musics');

  container.innerHTML = "";
  musics.forEach(music => {
    container.innerHTML += `
      <div class="song"data-audio="${music.audio}">
        <img class="songimg" src="${music.image}" alt="Song Image">
        <div class="songname">${music.name}</div>
        <div class="artist">${music.artist}</div>
      </div>`;
  });

  let songs = document.querySelectorAll('.song');
  playMusic(songs);
}



function attachAlbumListeners() {
  const items = document.querySelectorAll('.album');
  let artistNames = Object.keys(allArtists);

  items.forEach((el, index) => {
    el.addEventListener("click", () => {
      items.forEach(el => el.classList.remove("select"));
      el.classList.add("select");

      let artistName = artistNames[index]; 
      displaySongs(artistName);
    });
  });
}

function playMusic(songs) {
  songs.forEach(el => {
      el.addEventListener("click", () => {
        let audioSrc = el.getAttribute("data-audio");
  
        if (play_audio === audioSrc && !player.paused) {
          // Pause if same song clicked again
          player.pause();
        } else {
          // Load new song
          play_audio = audioSrc;
          player.src = audioSrc;
          player.play().catch(err => console.error("Play error:", err));
        }
        loadedSongs.push(el);
        currentTrackIndex = loadedSongs.indexOf(el);
        console.log("Current Track Index:", currentTrackIndex);
        console.log("Loaded Songs:", loadedSongs)
        console.log(loadedSongs[currentTrackIndex].getAttribute("src"))
        updateplayer();
      });
    });
  }
  function updateplayer() {
    
    let playercontainer = document.querySelector('.player-color');

  
    playercontainer.classList.add("musicplayer");
    let currentSong = loadedSongs[currentTrackIndex]; 
  

    let img = currentSong.querySelector(".songimg").src;
    let name = currentSong.querySelector(".songname").textContent;
    let artist = currentSong.querySelector(".artist").textContent;
    let audio = currentSong.getAttribute("data-audio");
  
    playercontainer.innerHTML = `
      <img src="${img}" class="playerimg" alt="${name}">
      <div class="musicname">${name}</div>
      <div class="musicartist">${artist}</div>
      <div class="controlpanel">
        <button><img class="controlicon-back icon" src="icons8-back.png" alt="back"></button>
        <button><img class="controlicon-pause icon" src="icons8-pause.png" alt="pause"></button>
        <button><img class="controlicon-forward icon" src="icons8-forward.png" alt="forward"></button>
        <button><img class="controlicon-add icon" src="icons8-add.png" alt="add to playlist"></button>
      </div>
      <div class="linebar"></div>`;

    attachControlListeners();
  }


function attachControlListeners() {
  let backBtn = document.querySelector('.controlicon-back');
  let forwardBtn = document.querySelector('.controlicon-forward');
  let pauseBtn = document.querySelector('.controlicon-pause');
  
  backBtn.addEventListener("click", () => {
    if (currentTrackIndex > 0) {
      currentTrackIndex--;
      let prevSong = loadedSongs[currentTrackIndex];
      play_audio = prevSong.getAttribute("data-audio");
      player.src = play_audio;
      player.play().catch(err => console.error("Play error:", err));
      updateplayer();
    }
  });
  forwardBtn.addEventListener("click", () => {
    if (currentTrackIndex < loadedSongs.length - 1) {
      currentTrackIndex++;
      let nextSong = loadedSongs[currentTrackIndex];
      play_audio = nextSong.getAttribute("data-audio");
      player.src = play_audio;
      player.play().catch(err => console.error("Play error:", err));
      updateplayer();
    }
  });
  pauseBtn.addEventListener("click", () => {
    if (player.paused) {
      player.play().catch(err => console.error("Play error:", err));
      pauseBtn.src = "icons8-pause.png";
    } else {
      player.pause();
      pauseBtn.src = "icons8-resume.png";
    }
  });
}
//const player = document.getElementById("player");
 // will hold songs for the selected artist

// Load songs for an artist
// function loadSongs(songs) {
//   playlist = songs;  
//   currentTrackIndex = -1; 
// }

// // Play a specific song
// function playSong(index) {
//   if (!playlist[index]) return;
  
//   currentTrackIndex = index;
//   player.src = playlist[index].streamUrl;
  
//   player.play()
//     .then(() => console.log("Playing:", playlist[index].title))
//     .catch(err => console.error("Play error:", err));
// }

// // Next & Previous
// function nextSong() {
//   if (currentTrackIndex < playlist.length - 1) {
//     playSong(currentTrackIndex + 1);
//   }
// }

// function prevSong() {
//   if (currentTrackIndex > 0) {
//     playSong(currentTrackIndex - 1);
//   }
// }

// // Pause & Resume
// function togglePlay() {
//   if (player.paused) {
//     player.play();
//   } else {
//     player.pause();
//   }
// }

// Seek bar (optional)
// const seekBar = document.getElementById("seek-bar");
// player.addEventListener("timeupdate", () => {
//   seekBar.value = (player.currentTime / player.duration) * 100 || 0;
// });

// seekBar.addEventListener("input", () => {
//   player.currentTime = (seekBar.value / 100) * player.duration;
// });





async function init() {
  allArtists = await fetchData();
  attachAlbumListeners();
}

init();






