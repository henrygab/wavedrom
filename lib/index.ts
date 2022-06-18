
import pkgX = require('../package.json');
import processAllX = require('./process-all.js');
import evaX = require('./eva.js');
import renderWaveFormX = require('./render-wave-form.js');
import renderWaveElementX = require('./render-wave-element.js');
import renderAnyX = require('./render-any.js');
import editorRefreshX = require('./editor-refresh.js');
import defX = require('../skins/default.js');
import onmlStringifyX = require('onml/stringify.js');

export const version = pkgX.version;
export const processAll = processAllX;
export const eva = evaX;
export const renderAny = renderAnyX;
export const renderWaveForm = renderWaveFormX;
export const renderWaveElement = renderWaveElementX;
export const editorRefresh = editorRefreshX;
export const waveSkin = defX;
export const onml = {
    stringify: onmlStringifyX
};
