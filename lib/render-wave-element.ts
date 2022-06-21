
import renderAny = require('./render-any.js');
import createElement = require('./create-element.js');

function renderWaveElement (index, source, outputElement, waveSkin, notFirstSignal) {

    // cleanup
    while (outputElement.childNodes.length) {
        outputElement.removeChild(outputElement.childNodes[0]);
    }

    outputElement.insertBefore(createElement(
        renderAny(index, source, waveSkin, notFirstSignal)
    ), null);
}

/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
module.exports = renderWaveElement;
