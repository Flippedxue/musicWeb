window.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');
  let loginOruser = document.querySelector('.topbar .bar-right .loginOruser');
  let logoutBtn = document.querySelector('.logout');
  let dropdown = document.querySelector('.login .dropdown');
  if (token) {
    loginOruser.innerText = '个人中心';
    loginOruser.href = '#';

    let homepageBtn = document.querySelector('.dropdown ul li:first-child a')
    if (homepageBtn) {
      homepageBtn.addEventListener('click', async function (e) {
        e.preventDefault();

        try {
          const res = await axios({
            url: 'http://localhost:8080/user/userInfo',
            method: 'get',
            headers: { 'Authorization': token }
          });

          if (res.data.code === 0) {
            localStorage.setItem('userData', JSON.stringify(res.data.data));
            console.log('用户信息', res.data.data);
            window.location.href = 'homepage.html';
          } else {
            console.log('错误信息', res.data.message);
          }

        } catch (error) {
          console.error('请求出错', error);
        }
      });
    }


    dropdown.style.display = 'none';
    loginOruser.addEventListener('mouseenter', function () {
      dropdown.style.display = 'block';
    });
    loginOruser.addEventListener('mouseleave', function () {
      dropdown.style.display = 'none';
    });

    dropdown.addEventListener('mouseenter', function () {
      dropdown.style.display = 'block';
    });


    dropdown.addEventListener('mouseleave', function () {
      dropdown.style.display = 'none';
    });
  } else {
    loginOruser.innerText = '登录';
    loginOruser.href = 'login.html';
    dropdown.style.display = 'none';
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      console.log('退出登录');
      localStorage.removeItem('token');
      if ('userData') localStorage.removeItem('userData');
      window.location.href = 'index.html';
    });
  }
});

const btn = document.querySelector('.top .bar-right .search input');
btn.addEventListener('keydown', function (e) {
  if (e.key === "Enter") {
    const keyword = document.querySelector(".top .bar-right .search input[type='text']").value.trim();
    //console.log(keyword);

    axios({
      url: 'http://localhost:8080/music/search',
      method: 'get',
      params: {
        key: keyword
      }
    }).then(result => {
      localStorage.setItem('songInfo', JSON.stringify(result.data.data))
      window.location.href = 'search.html'
    })
  }
})



const token = localStorage.getItem('token');
const btn_myMusic = document.querySelector('.top .list li:nth-child(5) a');
btn_myMusic.addEventListener('click', function () {
  axios({
    url: 'http://localhost:8080/myMusics/getMyMusics',
    method: 'get',
    headers: { 'Authorization': token }
  }).then(result => {
    localStorage.setItem('myMusicInfo', JSON.stringify(result.data.data))
    window.location.href = 'myMusic.html'

  })
});


const btn_musicList = document.querySelector('.top .list li:nth-child(3) a');
btn_musicList.addEventListener('click', function () {
  axios({
    url: 'http://localhost:8080/musicList/getUserMusicLists',
    method: 'get',
    headers: { 'Authorization': token }
  }).then(result => {
    localStorage.setItem('musicListInfo', JSON.stringify(result.data.data))
    window.location.href = 'musicList.html'

  })
});