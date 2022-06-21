
import render = require('bit-field/lib/render.js');

function renderReg (index, source) {
    return render(source.reg, source.config);
}

/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
module.exports = renderReg;
