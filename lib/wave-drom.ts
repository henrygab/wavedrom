
/* eslint-env browser */

interface IWaveDromWindow extends Window {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    WaveDrom?: any;
    /* eslint-enable  @typescript-eslint/no-explicit-any */
}
const waveDromWindow = window as Window as IWaveDromWindow;


import pkg = require('../package.json');
import processAll = require('./process-all.js');
import eva = require('./eva.js');
import renderWaveForm = require('./render-wave-form.js');
import editorRefresh = require('./editor-refresh.js');

waveDromWindow.WaveDrom.ProcessAll = processAll;
waveDromWindow.WaveDrom.RenderWaveForm = renderWaveForm;
waveDromWindow.WaveDrom.EditorRefresh = editorRefresh;
waveDromWindow.WaveDrom.eva = eva;
waveDromWindow.WaveDrom.version = pkg.version;

