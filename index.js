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
  makeTableImg(data, width, height);

}

function makeTableImg(pixelData, width, height) {
  const numY = (pixelData.length / 4) / width;
  const numX = (pixelData.length /4) / height;

  // document.querySelector('table').remove();
  document.querySelector('#imgContainer').remove();

  const table = document.createElement('div');

  table.setAttribute('id', 'imgContainer');
  // const table = document.createElement('table');
  // const thead = document.createElement('thead');
  // const tbody = document.createElement('tbody');
  // const trh = document.createElement('tr');


  table.style.width = `${numX}px`;
  table.style.height = `${numY}px`;
  const grid = [];

  let pixelIndex = 0;
  for (let x = 0; x < numX; x++) {
    const row = document.createElement('div');
    row.setAttribute('class', 'row');
    // const row = document.createElement('tr');
    // const th = document.createElement('th');
    // th.setAttribute('scope', 'col');

    // trh.appendChild(th);


    grid[x] = [];

    for (let y = 0; y < numY; y++) {
      // const cell = document.createElement('td');
      const cell = document.createElement('div');

      cell.setAttribute('class', 'pixel');

      
      const r = pixelData[pixelIndex];
      const g = pixelData[pixelIndex + 1 ];
      const b = pixelData[pixelIndex + 2 ];
      const a = pixelData[pixelIndex + 3 ];

      cell.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a/255})`;
      

      row.appendChild(cell);

      grid[x][y] = {
        r,
        g,
        b,
        a
      }


      pixelIndex += 4;
    }

    // tbody.appendChild(row);
    table.appendChild(row);
  }
  window.pgrid = grid;
  window.pdata = pixelData;

  // thead.appendChild(trh);
  // table.appendChild(thead);
  // table.appendChild(tbody);
  document.body.appendChild(table);
}



















urlForm.submit.click();