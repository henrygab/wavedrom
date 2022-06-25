
var renderAssign = require('logidrom/lib/render-assign.js');
var renderReg = require('./render-reg.js');

import { renderSignal } from './render-signal.js';

function renderAny (index, source, waveSkin, notFirstSignal) {
    var res = source.signal ?
        renderSignal(index, source, waveSkin, notFirstSignal) :
        source.assign ?
            renderAssign(index, source) :
            source.reg ?
                renderReg(index, source) :
                ['div', {}];

    res[1].class = 'WaveDrom';
    return res;
}

/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
module.exports = renderAny;
/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
module.exports.renderAny = renderAny;
