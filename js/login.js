const loginBtn = document.querySelector('.login-btn')
loginBtn.addEventListener('click', function (e) {
    e.preventDefault()

    const username = document.querySelector("input[type='text']").value.trim()
    const password = document.querySelector("input[type='password']").value.trim()

    if (!username || !password) {
        console.log('账号和密码不能为空！');
        return;
    }

    axios({
        url: 'http://localhost:8080/user/login',
        method: 'post',
        data: new URLSearchParams({
            username: username,
            password: password,
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(result => {
        if (result.data.code === 0) {
            localStorage.setItem('token', result.data.data)
            alert('登录成功')
            console.log('登录成功:', result.message);
            window.location.href = 'index.html'
        } else {
            alert('登录失败')
            console.error('登录失败:', result.message);
        }
    }).catch(error => {
        if (error.response) {
            console.error('请求失败:', error.response.data.message);
        } else {
            console.error('请求错误:', error.message);
        }
    })
})
