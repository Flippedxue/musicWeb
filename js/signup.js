const singupBtn = document.querySelector('.signup-btn')
singupBtn.addEventListener('click', function (e) {
    e.preventDefault()

    const username = document.querySelector("input[type='text']").value.trim()
    const password = document.querySelector("input[type='password']").value.trim()
    const termsAccepted = document.querySelector('.remember-forgot input[type="checkbox').checked;
    if (!username || !password) {
        alert('账号和密码不能为空！');
        return;
    }

    if (username.length < 5 || username.length > 16) {
        alert('用户名长度必须为 5 到 16 个字符！');
        return;
    }
    if (password.length < 5 || password.length > 16) {
        alert('密码长度必须为 5 到 16 个字符！');
        return;
    }

    if (!termsAccepted) {
        alert('请先同意所有条款！');
        return;
    }

    axios({
        url: 'http://localhost:8080/user/register',
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
            alert('注册成功')
            console.log('注册成功:', result.message);
        } else {
            alert(`注册失败：${result.data.message}`)
            console.error('注册失败:', result.message);
        }
    }).catch(error => {
        if (error.response) {
            console.error('请求失败:', error.response.data.message);
        } else {
            console.error('请求错误:', error.message);
        }
    })
})