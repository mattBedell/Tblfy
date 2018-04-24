const urlForm = document.querySelector('form');
const img = document.querySelector('img');
const canvas = document.querySelector('canvas');
const content = document.querySelector('#content');
const errEl = document.querySelector('#error');
const messageEl = document.querySelector('#message');

img.onload = () => {
  if (img.width === 0 || img.height === 0) {
    displayErrorMessage();
  } else {
    console.log('Fetched image...')
    return importImageIntoCanvas(img, img.width, img.height);
  }
}

img.onerror = () => {
  displayErrorMessage();
}

urlForm.addEventListener('submit', e => {
  e.preventDefault();
  displayMessage('Fetching image and building the table. This may take awhile...');

  let inputUrl = e.target.urlInput.value.replace(/^.*\:\/\//, '');

  fetch(`/proxyimage?url=${inputUrl}`)
  .then(r => {
    if (r.ok) {
      return r.blob();
    }

    throw new Error(`Response ${r.status}`);
  })
  .then(blob => {
    if (blob.size > 0) {
      return blob;
    }

    throw new Error('Bad blob');
  })
  .then(blob => URL.createObjectURL(blob))
  .then(url => {
    img.src = url
  })
  .catch(e => {
    displayErrorMessage();
  });
});

function importImageIntoCanvas(img, width, height) {
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  let data = ctx.getImageData(0, 0, width, height).data;

  console.log('Extracted pixel data, building table...');

  return makeTableImg(data, width, height);
}

function makeTableImg(pixelData, width, height) {
  return new Promise((resolve, reject) => {
    document.querySelector('table').remove();
    const table = document.createElement('table');
  
    table.style.width = `${width}px`;
    table.style.height = `${height}px`;
  
    let pixelIndex = 0;
  
    let row = document.createElement('tr');
    row.setAttribute('class', 'row');

    let rowIndex = 0;
    for (let i = 0; i < pixelData.length; i+=4) {

      if (i % (width * 4) === 0) {
        rowIndex += 1;
        table.appendChild(row);
        row = document.createElement('tr');
        row.setAttribute('class', 'row');

        if (Math.floor((i / (width * 4)* 100) / height) % 25 === 0) {
          console.log(`${Math.floor((i / (width * 4)* 100) / height)}%`);
        }
      }

      const pixel = document.createElement('td');
      pixel.setAttribute('class', 'pixel');
  
      const color = `rgba(${pixelData[pixelIndex]}, ${pixelData[pixelIndex + 1]}, ${pixelData[pixelIndex + 2]}, ${pixelData[pixelIndex + 3]})`;
      pixel.style.backgroundColor = color;
      row.appendChild(pixel);
      pixelIndex += 4;
    }
    console.log('Built table...')
    resolve(table)
  }).then(table => {
    console.log('Appending table to DOM...');
    content.appendChild(table);
    return true;
  })
  .then(p => clearMessages())
}

function displayErrorMessage() {
  clearMessages();
  errEl.classList.remove('hidden');
  messageEl.classList.add('hidden');
}

function displayMessage(message) {
  clearMessages();
  messageEl.textContent = message;
  errEl.classList.add('hidden');
  messageEl.classList.remove('hidden');
}

function clearMessages() {
  errEl.classList.add('hidden');
  messageEl.classList.add('hidden');
}
