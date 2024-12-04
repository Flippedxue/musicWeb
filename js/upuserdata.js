document.addEventListener('DOMContentLoaded', function () {

  const userData = localStorage.getItem('userData');

  if (userData) {
    const userDataObj = JSON.parse(userData);

    if (userDataObj) {
      document.querySelector('.main input[name="nickname"]').value = userDataObj.nickname || '未设置';
      userDataObj.gender === '男'
        ? document.querySelector('.main input[name="gender"][value="male"]').checked = true
        : document.querySelector('.main input[name="gender"][value="female"]').checked = true;
      document.querySelector('.main input[name="birthday"]').value = userDataObj.birthday || '未设置';
      document.querySelector('.main input[name="email"]').value = userDataObj.email || '未设置';
    } else {
      document.querySelector('.main input[name="area"]').value = userDataObj.region || '未设置';
      console.error('用户数据解析失败');
    }
  } else {
    console.log('没有用户数据可显示');
  }

  const saveButton = document.querySelector('#saveBtn');

  saveButton.addEventListener('click', async function (e) {
    e.preventDefault();

    const id = JSON.parse(localStorage.getItem('userData')).id;
    const nickname = document.querySelector('#nickname').value;
    const gender = document.querySelector('input[name="gender"]:checked').value === 'male' ? '男' : '女';
    const birthday = document.querySelector('#birthday').value;
    const email = document.querySelector('#email').value;
    const region = document.querySelector('#area').value;
    const token = localStorage.getItem('token');


    try {
      const res = await axios({
        url: 'http://localhost:8080/user/update',
        method: 'put',
        data: {
          id: id,
          username: null,
          nickname: nickname,
          email: email,
          gender: gender,
          region: region,
          birthday: birthday,
          musicList: null
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      if (res.data.code === 0) {
        alert('更新成功');

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

        homepageBtn.click();
      } else {
        alert('更新失败: ' + res.data.message);
      }
    } catch (error) {
      console.error('请求出错', error);
      alert('请求出错，请稍后尝试');
    }
  });
});


