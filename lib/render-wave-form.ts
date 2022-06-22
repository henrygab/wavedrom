/* eslint-env browser */

var renderWaveElement = require('./render-wave-element.js');

function renderWaveForm (index, source, output, notFirstSignal) {
    renderWaveElement(index, source, document.getElementById(output + index), window.WaveSkin, notFirstSignal);
}

/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
module.exports = renderWaveForm;

