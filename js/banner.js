document.addEventListener('DOMContentLoaded', function () {
  let dotsSelected = 0;

  const bannerArr = [
    { src: "../images/banner_01.jpg", src_bg: "../images/banner_bg_01.jpg" },
    { src: "../images/banner_02.jpg", src_bg: "../images/banner_bg_02.jpg" },
    { src: "../images/banner_03.jpg", src_bg: "../images/banner_bg_03.jpg" },
  ];

  const dots = document.querySelectorAll('.dots-list .item');
  const img = document.querySelector('.banner .area .img-list .item img');
  const img_bg = document.querySelector('.banner');
  const btn_left = document.querySelector('.banner .area .control.left');
  const btn_right = document.querySelector('.banner .area .control.right');

  if (!dots.length || !img || !img_bg || !btn_left || !btn_right) {
    console.error('某些必要的 DOM 元素未找到。请检查 HTML 结构。');
    return;
  }

  // 添加点击事件
  for (let i = 0; i < dots.length; i++) {
    dots[i].addEventListener('click', function (event) {
      event.preventDefault();
      updateBanner(i);
    });
  }

  let timeId = setInterval(function () {
    btn_right.click();
  }, 2000);

  img_bg.addEventListener('mouseleave', function () {
    timeId = setInterval(function () {
      btn_right.click();
    }, 2000);
  });

  img_bg.addEventListener('mouseenter', function () {
    clearInterval(timeId);
  });

  btn_left.addEventListener('click', function (event) {
    event.preventDefault();
    prev();
  });

  btn_right.addEventListener('click', function (event) {
    event.preventDefault();
    next();
  });

  function next() {
    updateBanner(dotsSelected === bannerArr.length - 1 ? 0 : dotsSelected + 1);
  }

  function prev() {
    updateBanner(dotsSelected === 0 ? bannerArr.length - 1 : dotsSelected - 1);
  }

  function updateBanner(index) {
    dots[dotsSelected].classList.remove('active');
    dotsSelected = index;
    dots[dotsSelected].classList.add('active');
    img.src = bannerArr[dotsSelected].src;
    img_bg.style.background = `url(${bannerArr[dotsSelected].src_bg}) center center / 6000px`;
  }
});