document.getElementById('uploadForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const token = localStorage.getItem('token');
  // 获取音乐文件和封面文件
  const musicFile = document.getElementById('musicFile').files[0];
  const coverFile = document.getElementById('coverFile').files[0];

  // 音乐信息
  const musicName = document.getElementById('musicName').value;
  const singerName = document.getElementById('singerName').value;
  const album = document.getElementById('album').value;
  const duration = document.getElementById('duration').value;
  const lyrics = document.getElementById('lyrics').value;

  // 设置 request 对象用于上传
  const formData = new FormData();
  formData.append('file', musicFile);

  // 上传音乐文件
  axios.post('http://localhost:8080/musicFile/upload', formData, {headers: {'Authorization':token}})
    .then(response => {
      const musicUrl = response.data.data;

      // 上传封面文件
      const coverFormData = new FormData();
      coverFormData.append('file', coverFile);

      return axios.post('http://localhost:8080/music/uploadMusicCover', coverFormData, {headers: {'Authorization':token}})
        .then(response => {
          const coverUrl = response.data.data;

          // 准备音乐信息
          const musicInfo = {
            musicName: musicName,
            singerName: singerName,
            album: album,
            duration: duration,
            url: musicUrl,
            musicPic: coverUrl,
            lyrics: lyrics
          };

          // 上传音乐信息
          return axios.post('http://localhost:8080/music/add', musicInfo, {headers: {'Authorization':token}});
        });
    })
    .then(response => {
      if (response.data.code === 0) {
        alert('音乐上传成功！');
      } else {
        alert('上传失败: ' + response.data.message);
      }
    })
    .catch(error => {
      console.error('上传过程中出错:', error);
      alert('上传时出错，请稍后重试');
    });
});
