
import { arcShape, IWaveDromPoint } from './arc-shape';
import { assert_for_review } from './assert';
import { renderLabel } from './render-label'

function renderArc (Edge, from, to, shapeProps) {
    return ['path', {
        id: 'gmark_' + Edge.from + '_' + Edge.to,
        d: shapeProps.d || 'M ' + from.x + ',' + from.y + ' ' + to.x + ',' + to.y,
        style: shapeProps.style || 'fill:none;stroke:#00F;stroke-width:1'
    }];
}

interface ILabelerElementType {
    node?   : string;
    period? : number;
    phase?  : number;
}
interface IRenderArcs_Parameter_Top {
    edge : string[];
}

// TODO: Update renderArcs: `source` should be the output of `rec()`
// TODO: swap last two parameters (lane, top), for greater consistency
//       with functions `renderPieceWise()`, `renderGaps()`, `renderMarks()`
// parameters:
//     source : 
export function renderArcs (
    source,
    index,
    top: IRenderArcs_Parameter_Top,
    lane
    ) {
    // TODO: define result type `res` more accurately
    let res : any[] = ['g', {id: 'wavearcs_' + index}];

    // Exit early if `source` isn't an array
    if (!Array.isArray(source)) { // short-circuit if `source` is not an array
        return res;
    }

    // `Events` is an associative array, where the key is any of the
    // allowed characters identifying an edge / arrow / spline endpoint.
    // (Typically, [A-Za-z]).
    //
    // The values are stored by the `labeler` function, and simply
    // store the x/y coordinates associated with that identifier (aka Event).
    //
    // The values are used by the `archer` to generate the corresponding
    // edge / arrow / spline. 
    const Events : Record< string | number | symbol, IWaveDromPoint > = {};


    // Used as `source.map(labeler)`
    // input `element` type: { node?: unknown, period?: number, phase?: number }
    // Output occurs to the parent scope's `Events` variable (!?)
    function labeler (element : ILabelerElementType, i : number) {

        // always update the lane period/phase, even if no element.node exists?
        lane.period = element.period ? element.period : 1;
        lane.phase  = (element.phase ? element.phase * 2 : 0) + lane.xmin_cfg;

        const text = element.node;
        if (text) {
            const stack = text.split('');
            for (let pos = 0; stack.length; ++pos) {
                
                const eventname = stack.shift();
                assert_for_review(eventname !== undefined, "if stack.length was true, then shift() should not have returned undefined?");
                if (eventname !== '.') { // any character EXCEPT '.' is to be labeled
                    
                    // store the position of this event label
                    const x =
                        lane.xs *
                        (2 * pos * lane.period * lane.hscale - lane.phase) +
                        lane.xlabel;
                    const y = i * lane.yo + lane.y0 + lane.ys * 0.5;
                    Events[eventname] = { x: x, y: y };
                }
                
            } // end for loop / while (stack.length)
        }
    
    } // end function `labeler`

    function archer (element : string) {
        // input: string representing the arc.
        // This function presumes that there is at least 
        // Examples:
        //     ''
        //     'a~b t1'
        //     'c-~a t2'
        //     'c-~>d time 3'
        //     'd~-e'
        //     'e~>f'
        //     'f->g'
        //     'g-~>h'
        //     'h~>i some text'
        //     'h~->j'
        //     'k-|-l    text with extra leading spaces',
        //
        // Additional incorrect examples, and what legacy code created:
        //     '-',   // from / to == '-', no shape
        //     'ab',  // from 'a' to 'b', no shape
        //     'a-',  // from 'a' to '0', no shape
        //
        // The first letter of words[0] ==> 'from'
        // The last  letter of words[0] ==> 'to'
        // All but first & last letters of words[0] ==> 'shape'
        
        const words = element.trim().split(/\s+/); // an array of all the words (wasteful!)
        // TODO: trim label to remove leading whitespace
        const Edge = {
            words: words, // TODO: remove this variable
            label: element.substring(words[0].length).substring(1),
            from:  words[0].substr(0, 1),
            to:    words[0].substr(-1, 1),
            shape: words[0].slice(1, -1)
        };
        
        // Only try to create an arc when both endpoints are defined
        const from = Events[Edge.from];
        const to   = Events[Edge.to  ];
        if (from && to) {
            const shapeProps = arcShape(Edge.shape, from, to, Edge.label ?? undefined);
            const lx = shapeProps.lx; // hold a copy, in case render label
            const ly = shapeProps.ly; // hold a copy, in case render label
            const renderArcResult = renderArc(Edge, from, to, shapeProps);
            res = res.concat([renderArcResult]);
            if (Edge.label) {
                const renderLabelResult = renderLabel({x: lx, y: ly}, Edge.label)
                res = res.concat([renderLabelResult]);
            }
        }
    }

    // Track location of all `Events` (endpoints) using function `labeler`
    source.map(labeler);
    // Create arcs using function `archer`
    if (Array.isArray(top.edge)) {
        top.edge.map(archer);
    }
    // Finally (unless it's an uppercase letter), render it as a label also.
    Object.keys(Events)
        .filter( (k) => k !== k.toLowerCase() )
        .filter( (k) => Events[k].x <= 0      )
        .map( (k) => {
            const point = { x: Events[k].x, y: Events[k].y };
            const renderLabelResult = renderLabel( point, k.toString() );
            res = res.concat([renderLabelResult]);
        });
    return res;
}

module.exports = renderArcs;
module.exports.renderArcs = renderArcs;
