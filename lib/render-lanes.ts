
import renderMarks = require('./render-marks.js');
import renderArcs = require('./render-arcs.js');
import renderGaps = require('./render-gaps.js');
import renderPieceWise = require('./render-piece-wise.js');

function renderLanes (index, content, waveLanes, ret, source, lane) {
    return [renderMarks(content, index, lane, source)]
        .concat(
            waveLanes.res,
            [
                renderArcs(ret.lanes, index, source, lane),
                renderGaps(ret.lanes, index, lane),
                renderPieceWise(ret.lanes, index, lane)
            ]
        );
}

/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
module.exports = renderLanes;
