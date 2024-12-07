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
});

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
                          <a class="btn favor" href="#" title="收藏"></a>
                          <a class="btn share" href="#" title="分享"></a>
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
                            <a class="url" href="#"></a>
                            <a class="musicPic" href="#"></a>
                            <a class="title" href="#">${item.musicName}</a>
                            <div class="operation">
                              <a class="btn add" href="#" title="添加到播放列表"></a>
                              <a class="btn favor" href="#" title="收藏"></a>
                              <a class="btn share" href="#" title="分享"></a>
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
    console.log(musicListName);

    const musicListPic = "../images/valorant.png"
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
        //调用接口获取用户歌单列表再渲染
        const btn_musicList = document.querySelector('.top .list li:nth-child(3) a');
        btn_musicList.click();
      })
    }
  })
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

// //删除歌单中的歌曲
// document.querySelector('.areaRight .musicList-result .musicList-result-list ul').addEventListener('click', function (e) {
//   if (e.target.classList.contains('delete')) {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     const musicId = parseInt(e.target.closest('.item').querySelector('.num').innerText);
//     //const musicListId = parseInt(e.target.closest('.musicList-result-list').querySelector('.num').innerText);
//     console.log(musicListId);
//     console.log(musicId);
    
//     if (musicId && musicListId) {
//       axios({
//         url: 'http://localhost:8080/musicList/deleteMusic',
//         method: 'post',
//         data: {
//           musicListId,
//           musicId
//         },
//         headers: { 'Authorization': token }
//       }).then(result => {
//         console.log(result.data.message);
//         //调用接口获取用户歌单列表再渲染
//         const btn_musicList = document.querySelector('.top .list li:nth-child(3) a');
//         btn_musicList.click();
//       })
//     }
//   }
// })
