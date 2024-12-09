let stateSet = document.querySelector(".state_set");
let musicHead = document.querySelector(".head");
let musicOBJ = document.querySelector("audio");
let proLine = document.querySelector(".pros");
let timeshow = document.querySelector(".time_show");
let musicLineMoveFa = document.querySelector(".progress");
let musicLineMove = document.querySelector(".pros");
let volumeBtn = document.querySelector(".volume");
let volumeBar = document.querySelector(".volume_range");
let volumePro = document.querySelector(".volume_range .range");
let listBtn = document.querySelector(".tool .list");
let listBar = document.querySelector(".tool .list_range");
let ulElement = document.querySelector('.tool .list_range ul');
let musicLast = document.querySelector(".last");
let musicNext = document.querySelector(".next");
let musicBOXbc = document.querySelector(".play_bc > img");
let musicInfoShow = document.querySelector(".music_info");
let playBox = document.querySelector(".play_box");

const musicListInfo = localStorage.getItem('musicListInfo');
let musicListId = 0;
//const btn_musicList = document.querySelector('.top .list li:nth-child(3) a');
document.addEventListener('DOMContentLoaded', function () {
  //渲染歌单列表
  if (musicListInfo) {
    const musicListObj = JSON.parse(musicListInfo);
    if (musicListObj) {
      let list = musicListObj;


      let theLi = list.map(item => `<li class="item_other">
                        <div class="item_pic">
                            <img src=${item.musicListPic} alt="">
                        </div>
                        <div class="item_info">
                            <span class="num">${item.id}</span>
                            <div class="pic">${item.musicListPic}</div>
                            <h3>${item.musicListName}</h3>
                        </div>
                        <div class="item_delete">
                          <a class="btn delete" href="#" title="删除"></a>
                        </div>
                    </li>`).join('');
      document.querySelector('.areaLeft .musicList_list ul').innerHTML = theLi;
    }
  }
  musicPlaySet();
  musicMove();
  musicListen();
  volumeSet();
  listSet();
  musicJump();
});

let time = null;
let time2 = null;
let time3 = null;
let time4 = null;
let f1 = false;
let f2 = true;
let i1 = 0;
let nowtime = 0;
let currtime = 0;
let currentIndex = 0;
let x = 0;
let musicList = [];
let musicidList = [];
let songSrc = "";
let songImg = "";
let songTitle = "";
let songId = 0;

//渲染歌单详情--歌曲列表
const musicList_li = document.querySelector('.musicList_list ul');
musicList_li.addEventListener('click', function (e) {
  if (e.target.classList.contains('item_info')) {
    e.preventDefault();
    musicListId = parseInt(e.target.closest('.item_info').querySelector('.num').innerText);
    console.log(musicListId);

    const token = localStorage.getItem('token');


    axios({
      url: 'http://localhost:8080/musicList/getMusics',
      method: 'get',
      params: {
        musicListId
      },
      headers: { 'Authorization': token }
    }).then(result => {
      const songObj = result.data.data;
      if (songObj) {
        let list = songObj;
        console.log(list);
        let theLi = list.map(item => `<li class="item">
                      <div class="name">
                        <a class="btn1 play1" href="#" title="播放"></a>
                        <a class="num" href="#">${item.id}</a>
                        <a class="url" href="#"></a>
                        <a class="musicPic" href="#"></a>
                        <a class="title" href="#">${item.musicName}</a>
                        <div class="operation">
                          <a class="btn add" href="#" title="添加到播放列表"></a>
                          <a class="btn download" href="#" title="下载"></a>
                          <a class="btn delete" href="#" title="删除"></a>
                        </div>
                      </div>
                      <div class="detail">
                        <a href="#">${item.singerName}</a>
                        <a href="#">${item.album}</a>
                        <a href="#">${item.duration}</a>
                      </div>
                    </li>`).join('');
        document.querySelector('.areaRight .musicList-result .musicList-result-list ul').innerHTML = theLi;
        //渲染右上角歌单的图片和名称
        const musicListPic = e.target.closest('.item_info').querySelector('.pic').innerText;
        const musicListName = e.target.closest('.item_info').querySelector('h3').innerText;
        const musicListObj = [
          {
            id: musicListId,
            musicListPic,
            musicListName
          }
        ];
        if (musicListObj) {
          let list = musicListObj;
          let theLi = list.map(item => `<div class="outline">
                <div class="avatar">
                  <img src=${item.musicListPic}>
                </div>
                <h1 class="avatar_title">
                  <span class="num">${item.id}</span>
                  <span class="name">${item.musicListName}</span>
                </h1>
            </div>`).join('');
          console.log(theLi);
          document.querySelector('.areaRight .outline').innerHTML = theLi;
        }
      }
      console.log(result);

    });
  }

  // 删除歌单中的歌曲
  document.querySelector('.areaRight .musicList-result .musicList-result-list ul').addEventListener('click', function (e) {
    //点击播放
    if (e.target.classList.contains('play1')) {
      e.preventDefault();

      songSrc = e.target.closest('.item1').querySelector('.url').innerText;
      songImg = e.target.closest('.item1').querySelector('.musicPic').innerText;
      songTitle = e.target.closest('.item1').querySelector('.title').innerText;

      musicInfoShow.innerText = songTitle;
      musicOBJ.src = songSrc;
      musicBOXbc.src = songImg;
      musicHead.src = songImg;

      musicStop();

      nowtime = 0;
      proLine.style.width = "0px";
      musicOBJ.currentTime = 0;

      musicOBJ.addEventListener('loadedmetadata', function () {
        stateSet.click();
      }, { once: true });
    }
    if (e.target.classList.contains('title')) {
      e.preventDefault();

      const musicId = e.target.closest('.item1').querySelector('.num').innerText;

      Promise.all([
        axios({
          url: 'http://localhost:8080/music/getMusicById',
          method: 'get',
          params: { musicId }
        }),
        axios({
          url: 'http://localhost:8080/comment/getComments',
          method: 'get',
          params: { musicId }
        })
      ]).then(results => {

        const musicResult = results[0];
        localStorage.setItem('songIf', JSON.stringify(musicResult.data.data));


        const commentResult = results[1];
        localStorage.setItem('commentIf', JSON.stringify(commentResult.data.data));
        window.location.href = 'song.html';
      }).catch(error => {
        console.error('请求发生错误:', error);
      });
    }
    //点击添加到播放列表
    if (e.target.classList.contains('add')) {
      e.preventDefault()

      songTitle = e.target.closest('.item1').querySelector('.title').innerText;
      songId = e.target.closest('.item1').querySelector('.num').innerText;
      if (!musicList.includes(songTitle)) {
        musicList.push(songTitle);
      } else {
        alert(songTitle + " 已经在播放列表中");
      }
      if (!musicidList.includes(songId)) {
        musicidList.push(songId);
      }
    }
    //点击删除
    if (e.target.classList.contains('delete')) {
      e.preventDefault();
      const token = localStorage.getItem('token');
      const musicId = parseInt(e.target.closest('.item').querySelector('.num').innerText);

      console.log(musicListId); // 确保 musicListId 全局变量可用
      console.log(musicId);

      if (musicId && musicListId) {
        axios({
          url: 'http://localhost:8080/musicList/deleteMusic',
          method: 'post',
          data: {
            musicListId,
            musicId
          },
          headers: { 'Authorization': token }
        }).then(result => {
          console.log(result.data.message);

          // 再次调用接口以获取更新后的歌曲列表
          axios({
            url: 'http://localhost:8080/musicList/getMusics',
            method: 'get',
            params: {
              musicListId
            },
            headers: { 'Authorization': token }
          }).then(res => {
            const songObj = res.data.data;
            if (songObj) {
              let list = songObj;
              let theLi = list.map(item => `<li class="item">
                          <div class="name">
                            <a class="btn1 play1" href="#" title="播放"></a>
                            <a class="num" href="#">${item.id}</a>
                            <a class="title" href="#">${item.musicName}</a>
                            <a class="url" href="#">${item.url}</a>
                            <a class="musicPic" href="#">${item.musicPic}</a>
                            <div class="operation">
                              <a class="btn add" href="#" title="添加到播放列表"></a>
                              <a class="btn download" href="#" title="下载"></a>
                              <a class="btn delete" href="#" title="删除"></a>
                            </div>
                          </div>
                          <div class="detail">
                            <a href="#">${item.singerName}</a>
                            <a href="#">${item.album}</a>
                            <a href="#">${item.duration}</a>
                          </div>
                        </li>`).join('');
              document.querySelector('.areaRight .musicList-result .musicList-result-list ul').innerHTML = theLi;
            }
          });
        });
      }
    }

  });


});
//active
let num = 0;
const musicList_Allli = document.querySelectorAll('.musicList_list ul li');
console.log(musicList_Allli);

for (let i = 0; i < musicList_Allli.length; i++) {
  musicList_Allli[i].addEventListener('click', function (e) {
    musicList_Allli[num].classList.remove('active');
    musicList_Allli[i].classList.add('active');
    num = i;
  });
}

//创建歌单
const btn_addMusicList = document.querySelector('.areaLeft .g_title button');

const win_box = document.querySelector('.win_box');
btn_addMusicList.addEventListener('click', function (e) {
  e.preventDefault();
  win_box.style.display = 'block';


  const token = localStorage.getItem('token');
  const newCreate = document.querySelector('.win_box .win_btn .new');
  newCreate.addEventListener('click', function (e) {
    e.preventDefault();
    const musicListName = document.querySelector('.win_box .win_input .cin').value.trim();
    const fileInput = document.querySelector('.win_input .file-input');
    const file = fileInput.files[0];

    if (!musicListName) {
      alert('请填写歌单名称');
      return;
    }

    if (!file) {
      alert('请上传歌单封面图片');
      return;
    }
    const reader = new FileReader();
    reader.onload = function (event) {
      const musicListPic = event.target.result; // Base64 字符串
      console.log(musicListPic);

      if (musicListName) {
        axios({
          url: 'http://localhost:8080/musicList/create',
          method: 'post',
          data: {
            musicListName,
            musicListPic
          },
          headers: { 'Authorization': token }
        }).then(result => {
          console.log(result);
          win_box.style.display = 'none';
          const btn_musicList = document.querySelector('.top .list li:nth-child(2) a');
          btn_musicList.click();
        });
      }
    };
    reader.readAsDataURL(file); // 读取文件并转换为 Base64
  });

  const cancel = document.querySelector('.win_box .win_btn .cancel');

  cancel.addEventListener('click', function (e) {
    e.preventDefault();
    win_box.style.display = 'none';
  })
  const quxiao = document.querySelector('.win_box .win_nav .close');
  quxiao.addEventListener('click', function (e) {
    e.preventDefault();
    win_box.style.display = 'none';
  })
});

// 音乐的开始和暂停方法
function musicPlaySet() {
  stateSet.onclick = function () {
    // 点击暂停的时候
    if (f1) {
      musicStop();
      //点击开始的时候
    } else {
      stateSet.className = "state_set iconfont icon-24gf-pause2";
      musicOBJ.play();
      musicTime();
      time = setInterval(() => {
        i1++;
        musicHead.style.transform = `rotate(${i1}deg)`;
      }, 20);
      f1 = true;
    }
  }
}

// 音乐对象的时间的显示方法
function musicTime() {

  let time = Math.floor(musicOBJ.duration);
  console.log(time);
  let minute = Math.floor(time / 60) + "";
  minute = minute < 10 ? "0" + minute : minute;
  let second = time % 60 + "";
  second = second < 10 ? "0" + second : second;
  time4 = setInterval(() => {
    let muscurrtime = musicOBJ.currentTime;
    let currminute = Math.floor(muscurrtime / 60) + "";
    currminute = currminute < 10 ? "0" + currminute : currminute;
    let currsecond = Math.floor(muscurrtime % 60) + "";
    currsecond = currsecond < 10 ? "0" + currsecond : currsecond;
    timeshow.innerText = `${currminute}:${currsecond} / ${minute}:${second}`;

  }, 1);
  time2 = setInterval(() => {
    let movetime = 330 / time;
    nowtime += movetime;
    proLine.style.width = nowtime + "px";
  }, 1000);
}

// 音乐进度拖动方法
function musicMove() {
  musicLineMove.onmousedown = function () {
    clearInterval(time);
    clearInterval(time2);
    clearInterval(time4);
    musicLineMoveFa.onmousemove = function (event) {
      clearInterval(time);
      clearInterval(time2);
      clearInterval(time4);
      x = event.clientX - (window.innerWidth - 330) / 2 - 30;
      proLine.style.width = x + "px";
      currtime = x / (330 / musicOBJ.duration);
    }
  }
  musicLineMove.onmouseup = function () {
    musicLineMoveFa.onmousemove = null;
    musicOBJ.currentTime = currtime;
    proLine.style.width = currtime * (330 / musicOBJ.duration) + "px";
    nowtime = currtime * (330 / musicOBJ.duration);
    musicTime();
    musicOBJ.play();
    stateSet.className = "state_set iconfont icon-24gf-pause2";
    time = setInterval(() => {
      i1++;
      musicHead.style.transform = `rotate(${i1}deg)`;
    }, 20);
    f1 = true;
  }
}

// 监听音乐的状态
function musicListen() {
  time3 = setInterval(() => {
    if (musicOBJ.ended) {
      proLine.style.width = "0px";
      stateSet.className = "state_set iconfont icon-bofang";
      nowtime = 0;
      clearInterval(time);
      clearInterval(time2);
      clearInterval(time3);
      clearInterval(time4);
      f1 = false;
    }
  }, 1000);
}

// 音乐的音量调节
function volumeSet() {
  volumePro.autofocus = true;
  volumePro.defaultValue = 100;
  volumePro.step = 1;
  volumePro.max = 100;
  volumePro.min = 0;
  volumeBtn.onmouseenter = function () {
    volumeBar.style.height = "100px";
    volumeBar.style.padding = "5px";
    volumeBar.style.top = "-110px";
    volumeBtn.onclick = function () {
      if (f2) {
        volumePro.disabled = true;
        volumeBtn.className = "volume iconfont icon-volumeDisable";
        musicOBJ.muted = true;
        f2 = false;
      } else {
        volumePro.disabled = false;
        volumeBtn.className = "volume iconfont icon-volumeMiddle";
        musicOBJ.muted = false;
        f2 = true;
      }
    }
  }
  volumeBtn.onmouseleave = function () {
    volumeBar.style.height = "0px";
    volumeBar.style.padding = "0px";
    volumeBar.style.top = "0px";
  }
  volumePro.onfocus = function () {
    volumeBtn.onclick = null;
    this.onchange = function () {
      musicOBJ.volume = this.value / 100;
      console.log(this.value);
      if (this.value === 0) {
        volumeBtn.className = "volume iconfont icon-volumeDisable";
        f2 = false;
      }
    }
  }
}
// 列表
function listSet() {
  listBtn.onmouseenter = function () {
    listBar.style.height = "500px";
    listBar.style.maxHeight = "500px";
    listBar.style.overflow = "auto";
    listBar.style.padding = "10px";
    listBar.style.top = "-500px";

    ulElement.innerHTML = '';

    musicList.forEach(function (music, index) {
      let liElement = document.createElement('li');
      liElement.style.display = 'flex';
      liElement.style.justifyContent = 'space-between';
      liElement.style.alignItems = 'center';

      let musicText = document.createTextNode(music);
      liElement.appendChild(musicText);

      let deleteBtn = document.createElement('span');
      deleteBtn.textContent = '×';
      deleteBtn.style.cursor = 'pointer';
      deleteBtn.style.marginLeft = '10px';

      // 添加删除按钮的点击事件
      deleteBtn.onclick = function () {
        ulElement.removeChild(liElement);

        musicList.splice(index, 1);
        musicidList.splice(index, 1);
      };

      liElement.appendChild(deleteBtn);
      ulElement.appendChild(liElement);
    });

  }
  listBtn.onmouseleave = function () {
    listBar.style.height = "0px";
    listBar.style.padding = "0px";
    listBar.style.top = "0px";
  }
}
//下一首和上一首
function musicJump() {
  function updateMusic() {
    const songObj = JSON.parse(localStorage.getItem('songInfo'));

    for (let i = 0; i < songObj.length; i++) {
      if (songObj[i].id == musicidList[currentIndex]) {
        musicOBJ.src = songObj[i].url;
        musicBOXbc.src = songObj[i].musicPic;
        musicHead.src = songObj[i].musicPic;
        musicInfoShow.innerText = musicList[currentIndex];
      }
    }

    nowtime = 0;
    musicStop();
  }

  musicLast.onclick = function () {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = musicList.length - 1;
    }
    updateMusic();
  }

  musicNext.onclick = function () {
    currentIndex++;
    if (currentIndex >= musicList.length) {
      currentIndex = 0;
    }
    updateMusic();
  }

  updateMusic();
}

// 音乐停止状态
function musicStop() {
  stateSet.className = "state_set iconfont icon-bofang";
  musicOBJ.pause();
  clearInterval(time);
  clearInterval(time2);
  clearInterval(time4);
  f1 = false;
}
//播放栏显示隐藏
document.addEventListener('mousemove', function (event) {
  const mouseY = event.clientY;
  const windowHeight = window.innerHeight;
  const distanceFromBottom = windowHeight - mouseY;

  if (distanceFromBottom < 1000) {
    playBox.style.visibility = 'visible';
    const opacityValue = 1 - distanceFromBottom / 1000;
    playBox.style.opacity = opacityValue;
  } else {
    playBox.style.opacity = 0;
    playBox.style.visibility = 'hidden';
  }
});

