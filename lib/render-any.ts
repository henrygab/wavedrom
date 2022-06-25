
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

module.exports = renderAny;
module.exports.renderAny = renderAny;
