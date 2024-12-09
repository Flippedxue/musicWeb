const canvas = document.querySelector(".main .container .left .canvas");
const previewLarge = document.querySelector(".main .container .right .previewLarge");
const fileInput = document.querySelector(".main .fileInput");
const saveButton = document.querySelector(".main .container .left .save");
const cancelButton = document.querySelector(".main .container .left .cancel");

class ImgCrop {
  constructor(canvas, previewLarge, fileInput) {
    this.canvas = canvas;
    this.previewLarge = previewLarge;
    this.fileInput = fileInput;
    this.ctx = canvas.getContext("2d");
    this.previewLargeCtx = previewLarge.getContext("2d");
    this.imgObj = null;
    this.sourceWidth = 0;
    this.sourceHeight = 0;
    this.scale = 1;
    this.width = 50;
    this.height = 50;
    this.x = 0;
    this.y = 0;
    this.isDown = false;

    this.fileInput.addEventListener("change", this.loadImage.bind(this));
    this.canvas.addEventListener("mousemove", this.mouseMoveHandle.bind(this));
    this.canvas.addEventListener("mousedown", this.mouseDownHandle.bind(this));
    this.canvas.addEventListener("mouseup", this.mouseUpHandle.bind(this));
    this.canvas.addEventListener("mouseleave", this.mouseLeave.bind(this));
    saveButton.addEventListener("click", this.uploadAvatar.bind(this));
    cancelButton.addEventListener("click", this.resetCanvas.bind(this));
  }

  loadImage(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imgObj = new Image();
        this.imgObj.src = e.target.result;
        this.imgObj.onload = () => {
          // 动态获取最大宽高并计算缩放比例
          const containerWidth = document.querySelector('.main .container').offsetWidth * 0.9;
          const containerHeight = window.innerHeight * 0.7;
          const maxWidth = Math.min(500, containerWidth);
          const maxHeight = Math.min(500, containerHeight);
          const widthRatio = maxWidth / this.imgObj.width;
          const heightRatio = maxHeight / this.imgObj.height;
          this.scale = Math.min(widthRatio, heightRatio, 1);

          this.sourceWidth = this.imgObj.width;
          this.sourceHeight = this.imgObj.height;
          this.canvas.width = this.imgObj.width * this.scale;
          this.canvas.height = this.imgObj.height * this.scale;

          this.width = 50;
          this.height = 50;
          this.x = 0;
          this.y = 0;

          this.drawImg();
        };
      };
      reader.readAsDataURL(file);
    }
  }

  drawImg() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.imgObj, 0, 0, this.sourceWidth, this.sourceHeight, 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'rgba(0, 0, 0, .5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawCrop();
  }

  drawCrop() {
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
    this.ctx.drawImage(
      this.imgObj,
      this.x / this.scale,
      this.y / this.scale,
      this.width / this.scale,
      this.height / this.scale,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(this.x + this.width - 3, this.y + this.height - 3, 6, 6);
    this.updatePreview();
  }

  mouseMoveHandle(e) {
    const { offsetX, offsetY } = e;
    let moveX = offsetX - this.downOffset?.[0];
    let moveY = offsetY - this.downOffset?.[1];

    if (offsetX >= this.x && offsetX <= (this.x + this.width - 10) &&
      offsetY >= this.y && offsetY <= (this.y + this.height - 10)) {
      this.canvas.style.cursor = "move";
      if (this.isDown) {
        this.x = Math.min(Math.max(this.x + moveX, 0), this.canvas.width - this.width);
        this.y = Math.min(Math.max(this.y + moveY, 0), this.canvas.height - this.height);
        this.drawImg();
        this.downOffset = [offsetX, offsetY];
      }
    } else if (offsetX >= (this.x + this.width - 10) && offsetX <= (this.x + this.width + 10) &&
      offsetY >= (this.y + this.height - 10) && offsetY <= (this.y + this.height + 10)) {
      this.canvas.style.cursor = "nwse-resize";
      if (this.isDown) {
        let newSize = Math.max(this.width + moveX, 20);
        this.width = this.height = newSize;
        this.drawImg();
        this.downOffset = [offsetX, offsetY];
      }
    } else {
      this.canvas.style.cursor = "default";
    }
  }

  mouseDownHandle(e) {
    const { offsetX, offsetY } = e;
    this.isDown = true;
    this.downOffset = [offsetX, offsetY];
  }

  mouseUpHandle() {
    this.isDown = false;
  }

  mouseLeave() {
    this.isDown = false;
  }

  updatePreview() {
    const scaleX = 1 / this.scale;
    const scaleY = 1 / this.scale;
    this.previewLargeCtx.clearRect(0, 0, this.previewLarge.width, this.previewLarge.height);
    this.previewLargeCtx.drawImage(
      this.imgObj,
      this.x * scaleX,
      this.y * scaleY,
      this.width * scaleX,
      this.height * scaleY,
      0,
      0,
      this.previewLarge.width,
      this.previewLarge.height
    );
  }

  uploadAvatar() {
    if (!this.imgObj) {
      alert('请先选择一张图片');
      return;
    }

    const scaleX = 1 / this.scale;
    const scaleY = 1 / this.scale;

    const canvasToUpload = document.createElement('canvas');
    canvasToUpload.width = this.width * scaleX;
    canvasToUpload.height = this.height * scaleY;
    const ctx = canvasToUpload.getContext('2d');

    ctx.drawImage(
      this.imgObj,
      this.x * scaleX,
      this.y * scaleY,
      this.width * scaleX,
      this.height * scaleY,
      0,
      0,
      canvasToUpload.width,
      canvasToUpload.height
    );

    const formData = new FormData();
    const token = localStorage.getItem('token');
    canvasToUpload.toBlob(blob => {
      formData.append('file', blob, 'avatar.png');
      axios.post('http://localhost:8080/user/uploadAvatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token
        }
      })
        .then(response => {
          if (response.data.code === 0) {
            alert('头像上传成功');
          } else {
            alert('头像上传失败: ' + response.data.message);
          }
        })
        .catch(error => {
          alert('上传过程中发生错误');
        });
    }, 'image/png');
  }

  resetCanvas() {
    this.imgObj = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.previewLargeCtx.clearRect(0, 0, this.previewLarge.width, this.previewLarge.height);
    this.fileInput.value = '';
  }
}

const imgCrop = new ImgCrop(canvas, previewLarge, fileInput);