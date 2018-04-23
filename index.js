const urlForm = document.querySelector('form');
const img = document.querySelector('img');
const canvas = document.querySelector('canvas');
const errEl = document.querySelector('#err');

img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  importImageIntoCanvas(img);
}

urlForm.addEventListener('submit', e => {
  e.preventDefault();
  errEl.style.display = 'none';

  let inputUrl = e.target.urlInput.value.replace(/^.*\:\/\//, '');

  fetch(`/proxyimage?url=${inputUrl}`)
  .then(r => {
    if (r.ok) {
      return r.blob();
    }

    throw new Error(`Response ${r.status}`);
  })
  .then(r => URL.createObjectURL(r))
  .then(url => {
    img.src = url
  })
  .catch(e => {
    errEl.style.display = 'inherit';
  });



});

function importImageIntoCanvas(img) {
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const { left, top, width, height } = canvas.getBoundingClientRect();

  let data = ctx.getImageData(0, 0, width, height).data;

  // const numRows

  // console.log((data.length / 4)/ width);

}



















urlForm.submit.click();