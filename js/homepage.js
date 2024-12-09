document.addEventListener('DOMContentLoaded', function () {
  const userData = localStorage.getItem('userData');

  if (userData) {
    const userDataObj = JSON.parse(userData);

    if (userDataObj) {
      document.querySelector('.main .personalData .areaLeft .userHead img').src = userDataObj.userPic || '';
      document.querySelector('.main .personalData .areaRight .userInfo .userName span').innerText = userDataObj.nickname || '用户名：未设置';
      document.querySelector('.main .personalData .areaRight .userInfo .userEmail span').innerText = `电子邮件：${userDataObj.email || '未设置'}`;
      document.querySelector('.main .personalData .areaRight .userInfo .userArea span').innerText = `所在地区：${userDataObj.region || '未设置'}`;
      document.querySelector('.main .personalData .areaRight .userInfo .userBirth span').innerText = `生日：${userDataObj.birthday || '未设置'}`;
      document.querySelector('.main .personalData .areaRight .userInfo .userGender span').innerText = `性别：${userDataObj.gender || '未设置'}`;
    } else {
      console.error('用户数据解析失败');
    }
  } else {
    console.log('没有用户数据可显示');
  }
});

const infoBtn = document.querySelector('.edit')
const infoBtni = document.querySelector('.edit i')
infoBtn.addEventListener('mousedown', function () {
  infoBtn.classList.add('active')
  infoBtni.classList.add('active')
})
infoBtn.addEventListener('mouseup', function () {
  infoBtn.classList.remove('active')
  infoBtni.classList.remove('active')
})


