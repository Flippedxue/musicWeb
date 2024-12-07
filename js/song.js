const tx = document.querySelector('#tx');
const total = document.querySelector('.total')
tx.addEventListener('input', function () {
  total.innerHTML = `${tx.value.trim().length}/140`
  if(tx.value.trim().length > 140){
    alert("字数超出限制")
  }
})
tx.addEventListener('keyup', function (e) {
  if (e.key === 'Enter') {
    if (tx.value.trim()) {
      axios({
        url: 'http://localhost:8080/comment/add',
        method: 'post',
        data : {
          musicId: 1,
          content: tx.value.trim(),
        }
      }).then(res => {
        alert('评论成功')
      })
    }
    tx.value = ''
    total.innerHTML = '0/140'
  }
})