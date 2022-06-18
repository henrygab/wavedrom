import charWidth = require('./char-width.json');

/**
    Calculates text string width in pixels.

    @param {String} str text string to be measured
    @param {Number} size font size used
    @return {Number} text string width
*/

module.exports = function (str : string, size? : number) : number {
    const len = str.length;
    let width = 0;
    for (let i = 0; i < len; i++) {
        const c = str.charCodeAt(i);
        let w = charWidth.chars[c];
        if (w === undefined) {
            w = charWidth.other;
        }
        width += w;
    }
    size = size || 11; // default size 11pt
    return (width * size) / 100; // normalize
};
