const urlForm = document.querySelector('form');
const img = document.querySelector('img');
const canvas = document.querySelector('canvas');
const content = document.querySelector('#content');
const errEl = document.querySelector('#error');
const messageEl = document.querySelector('#loading');

img.onload = () => {
  importImageIntoCanvas(img, img.width, img.height);
  messageEl.classList.add('hidden');
}

urlForm.addEventListener('submit', e => {
  e.preventDefault();
  messageEl.classList.remove('hidden');
  errEl.classList.add('hidden');


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
    errEl.classList.remove('hidden');
  });
});

function importImageIntoCanvas(img, width, height) {
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  let data = ctx.getImageData(0, 0, width, height).data;
  
  makeTableImg(data, width, height);
}

function makeTableImg(pixelData, width, height) {
  const numY = (pixelData.length / 4) / width;
  const numX = (pixelData.length /4) / height;

  document.querySelector('table').remove();
  const table = document.createElement('table');

  table.style.width = `${numX}px`;
  table.style.height = `${numY}px`;

  let pixelIndex = 0;

  let row = document.createElement('tr');
  row.setAttribute('class', 'row');

  for (let i = 0; i < pixelData.length; i++) {

    if (i % width === 0) {
      table.appendChild(row);
      row = document.createElement('tr');
      row.setAttribute('class', 'row');
    }

    const pixel = document.createElement('td');
    pixel.setAttribute('class', 'pixel');

    const color = `rgba(${pixelData[pixelIndex]}, ${pixelData[pixelIndex + 1]}, ${pixelData[pixelIndex + 2]}, ${pixelData[pixelIndex + 3]})`;
    pixel.style.backgroundColor = color;
    row.appendChild(pixel);
    pixelIndex += 4;
  }

  content.appendChild(table);
}
