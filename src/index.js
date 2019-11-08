const fs = require('fs');

// lib to read and write to the zip
const JSZip = require('jszip');

fs.readFile('Untitled3.sketch', function (err, data) {
  if (err) throw err;
  JSZip.loadAsync(data).then(function (zip) {
    // zip contains a json file that describes all the directory & files in the zip file

    // read the top level page
    // hardcoding page because im lazy ;)
    const pagePath = Object.keys(zip.files)[1];

    zip.file(pagePath)
      .async('string')
      .then(function (str) {
        const json = JSON.parse(str);

        // grab the first layer which in my case is a text layer
        const text = json.layers[0];
        text.name = 'Changing the layer name';

        fs.writeFileSync('Untitled3.json', JSON.stringify(text));

        // write the page json back to the file in the zip
        zip.file(pagePath, JSON.stringify(json))

        // override the original file
        zip
          .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
          .pipe(fs.createWriteStream('Untitled3.sketch'))
          .on('finish', () => {
            console.log('yay saved file. Open me in sketch to see the changes');
          });
      });
  });
});
