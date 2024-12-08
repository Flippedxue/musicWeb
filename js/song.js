const musicName = document.querySelector('.main .song .songInfo .title')
const singerName = document.querySelector('.main .song .songInfo .singer')
const album = document.querySelector('.main .song .songInfo .album')
const musicPic = document.querySelector('.main .song .songHead img')
const lyrics = document.querySelector('.main .song .songInfo .lyrics')
const userHead = document.querySelector('.main .comment .cmmt .user .head img')
const commentList = document.querySelector('.main .comment .cmmts .comment-list')
const tx = document.querySelector('#tx');
const total = document.querySelector('.total')
const commentBtn = document.querySelector('.commentBtn')
const lyricsElement = document.querySelector('#lyrics');
const toggleBtn = document.querySelector('#toggleLyricsBtn');

const songIf = JSON.parse(localStorage.getItem('songIf'))
const commentIf = JSON.parse(localStorage.getItem('commentIf'))
const userData = JSON.parse(localStorage.getItem('userData'))

let isExpanded = false;

document.addEventListener('DOMContentLoaded', function () {
  setSongIf()
  setuserIf()
  setText()
  setcommentIf()
})
//更新歌曲信息
function setSongIf() {
  musicName.innerHTML = songIf.musicName
  singerName.innerHTML = songIf.singerName
  album.innerHTML = songIf.album
  musicPic.src = songIf.musicPic

  lyrics.innerHTML = formatLyrics(songIf.lyrics);
  initLyricsToggle();
}
//更新歌词
function formatLyrics(lyrics) {
  const lines = lyrics.split('\n');
  const formattedLyrics = lines.map(line => line.trim()).filter(line => line).join('<br>');
  return formattedLyrics; // 返回格式化的歌词
}
//初始化歌词展开收起功能
function initLyricsToggle() {

  const lines = lyricsElement.innerHTML.split('<br>');
  if (lines.length > 13) {
    lyricsElement.innerHTML = lines.slice(0, 13).join('<br>');
  }

  toggleBtn.addEventListener('click', function () {
    if (isExpanded) {
      // 点击收起
      lyricsElement.innerHTML = lines.slice(0, 13).join('<br>');
      toggleBtn.textContent = "展开";
    } else {
      // 点击展开
      lyricsElement.innerHTML = lines.join('<br>');
      toggleBtn.textContent = "收起"; // 改变按钮文本
    }
    isExpanded = !isExpanded; // 切换状态
  });
}

function setuserIf() {
  userHead.src = userData.userPic
}

function setcommentIf() {
  commentList.innerHTML = '';
  commentIf.slice().reverse().forEach(comment => {
    const li = document.createElement('li')
    li.classList.add('item')

    const itmDiv = document.createElement('div')
    itmDiv.classList.add('itm')

    const headDiv = document.createElement('div')
    headDiv.classList.add('head')
    const avatarImg = document.createElement('img');
    avatarImg.src = comment.userAvatar || '../images/userHead_01.jpg';
    headDiv.appendChild(avatarImg);

    const cntDiv = document.createElement('div')
    cntDiv.classList.add('cnt');
    const nameLink = document.createElement('a');
    nameLink.href = '#';
    nameLink.classList.add('name');
    nameLink.textContent = comment.nickname;

    cntDiv.appendChild(nameLink);
    cntDiv.appendChild(document.createTextNode(' ：' + comment.content));

    const timeDiv = document.createElement('div');
    timeDiv.classList.add('time');
    timeDiv.textContent = comment.createTime;

    itmDiv.appendChild(headDiv);
    itmDiv.appendChild(cntDiv);
    li.appendChild(itmDiv);
    li.appendChild(timeDiv);

    if (comment.userId === userData.id) {
      const deleteLink = document.createElement('a');
      deleteLink.classList.add('delete');
      deleteLink.textContent = '删除';
      deleteLink.setAttribute('data-userId', comment.userId);
      deleteLink.setAttribute('data-commentId', comment.id);

      deleteLink.addEventListener('click', function (e) {
        e.preventDefault();
        const token = localStorage.getItem('token')
        axios({
          url: 'http://localhost:8080/comment/delete',
          method: 'POST',
          params: {
            commentId: comment.id
          },
          headers: { 'Authorization': token }
        }).then(res => {
          if (res.data.code === 0) {

            resetCommentIf();
          } else {
            alert(res.data.message);
          }
        }).catch(error => {
          console.error('删除评论失败:', error);
          alert('删除评论失败，请重试。');
        });
      });

      li.appendChild(deleteLink);
    }

    commentList.appendChild(li);
  }
  )
}

function resetCommentIf() {
  axios({
    url: 'http://localhost:8080/comment/getComments',
    method: 'get',
    params: {
      musicId: songIf.id // 假设接口需要音乐ID作为参数
    }
  }).then(res => {
    if (res.data.code === 0) {
      // 清空评论列表
      commentList.innerHTML = '';
      // 遍历评论数据并渲染
      localStorage.setItem('commentIf', JSON.stringify(res.data.data))
      res.data.data.slice().reverse().forEach(comment => {
        const li = document.createElement('li');
        li.classList.add('item');

        const itmDiv = document.createElement('div');
        itmDiv.classList.add('itm');

        const headDiv = document.createElement('div');
        headDiv.classList.add('head');
        const avatarImg = document.createElement('img');
        avatarImg.src = comment.userAvatar || '../images/userHead_01.jpg';
        headDiv.appendChild(avatarImg);

        const cntDiv = document.createElement('div');
        cntDiv.classList.add('cnt');
        const nameLink = document.createElement('a');
        nameLink.href = '#';
        nameLink.classList.add('name');
        nameLink.textContent = comment.nickname;

        cntDiv.appendChild(nameLink);
        cntDiv.appendChild(document.createTextNode(' ：' + comment.content));

        const timeDiv = document.createElement('div');
        timeDiv.classList.add('time');
        timeDiv.textContent = comment.createTime;

        itmDiv.appendChild(headDiv);
        itmDiv.appendChild(cntDiv);
        li.appendChild(itmDiv);
        li.appendChild(timeDiv);

        if (comment.userId === userData.id) {
          const deleteLink = document.createElement('a');
          deleteLink.classList.add('delete');
          deleteLink.textContent = '删除';
          deleteLink.setAttribute('data-userId', comment.userId);
          deleteLink.setAttribute('data-commentId', comment.id);

          deleteLink.addEventListener('click', function (e) {
            e.preventDefault();
            const token = localStorage.getItem('token')
            axios({
              url: 'http://localhost:8080/comment/delete',
              method: 'POST',
              params: {
                commentId: comment.id
              },
              headers: { 'Authorization': token }
            }).then(res => {
              if (res.data.code === 0) {

                resetCommentIf();
              } else {
                alert(res.data.message);
              }
            }).catch(error => {
              console.error('删除评论失败:', error);
              alert('删除评论失败，请重试。');
            });
          });

          li.appendChild(deleteLink);
        }

        commentList.appendChild(li);
      });
    } else {
      alert('获取评论失败：' + res.data.message);
    }
  }).catch(error => {
    console.error('错误:', error);
    alert('获取评论失败，请重试。');
  });
}

function setText() {
  tx.addEventListener('input', function () {
    total.innerHTML = `${tx.value.trim().length}/140`
    if (tx.value.trim().length > 140) {
      alert("字数超出限制")
    }
  })
  commentBtn.addEventListener('click', function (e) {
    if (tx.value.trim()) {
      const token = localStorage.getItem('token')
      axios({
        url: 'http://localhost:8080/comment/add',
        method: 'post',
        data: {
          musicId: songIf.id,
          content: tx.value.trim(),
        },
        headers: { 'Authorization': token }
      }).then(res => {
        if (res.data.code === 0) {
          resetCommentIf();
          tx.value = ''
          total.innerHTML = '0/140'
        } else {
          alert('评论上传失败：' + res.data.message);
        }
      })
    }
  })
}
