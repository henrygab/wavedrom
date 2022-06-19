
import  rec               = require('./rec.js');
import  laneFromImport    = require('./lane.js');
import  parseConfig       = require('./parse-config.js');
import  parseWaveLanes    = require('./parse-wave-lanes.js');
import  renderGroups      = require('./render-groups.js');
import  renderLanes       = require('./render-lanes.js');
import  renderWaveLane    = require('./render-wave-lane.js');
import  insertSVGTemplate = require('./insert-svg-template.js');

function laneParamsFromSkin (index : number, source, lane, waveSkin) {

    // do NOT run except for the first index
    // This appears to presume it will always
    // be called at least once for index === 0?
    if (index !== 0) { return; }

    // this appears to be getting the 
    let first;
    for (first in waveSkin) { break; }

    let skin = waveSkin.default || waveSkin[first];

    // if the configuration indicates a skin to use, then use that instead
    const cfgSkin = source?.config?.skin;
    if (null != cfgSkin && waveSkin[source.config.skin]) {
        skin = waveSkin[source.config.skin];
    }

    // BUGBUG -- what are these magic numbers? [3][1][2][1]  -- VERY FRAGILE CODE !!!!
    const socket = skin[3][1][2][1];

    lane.xs     = Number(socket.width);
    lane.ys     = Number(socket.height);
    lane.xlabel = Number(socket.x);
    lane.ym     = Number(socket.y);
}

export function renderSignal (index : number, source, waveSkin, notFirstSignal : boolean) {

    laneParamsFromSkin (index, source, laneFromImport, waveSkin);

    // ParseConfig() might modify both source and laneFromImport...
    parseConfig(source, laneFromImport);
    var ret = rec(source.signal, {'x':0, 'y':0, 'xmax':0, 'width':[], 'lanes':[], 'groups':[]});
    var content = parseWaveLanes(ret.lanes, laneFromImport);

    var waveLanes = renderWaveLane(content, index, laneFromImport);
    var waveGroups = renderGroups(ret.groups, index, laneFromImport);

    var xmax = waveLanes.glengths.reduce(
        function (res, len, i : number) {
            return Math.max(res, len + ret.width[i]);
        },
        0
    );

    laneFromImport.xg = Math.ceil((xmax - laneFromImport.tgo) / laneFromImport.xs) * laneFromImport.xs;

    const tmp = renderLanes(index, content, waveLanes, ret, source, laneFromImport);
    return insertSVGTemplate(
        index, source, laneFromImport, waveSkin, content,
        tmp,
        waveGroups,
        notFirstSignal
    );

}
