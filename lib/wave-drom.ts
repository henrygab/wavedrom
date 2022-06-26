
// the combination of `export{};` *AND*  the `declare global {}` block
// appear to enable the `window.WaveDrom` style of augmenting `window`.

export {};
declare global {
    interface Window {
        WaveDrom? : any; // TODO: Define the object type!
    }
}

window.WaveDrom = window.WaveDrom || {};

var pkg = require('../../package.json');
var processAll = require('./process-all.js');
var eva = require('./eva.js');
var renderWaveForm = require('./render-wave-form.js');
var editorRefresh = require('./editor-refresh.js');

window.WaveDrom.ProcessAll = processAll;
window.WaveDrom.RenderWaveForm = renderWaveForm;
window.WaveDrom.EditorRefresh = editorRefresh;
window.WaveDrom.eva = eva;
window.WaveDrom.version = pkg.version;

/* eslint-env browser */
