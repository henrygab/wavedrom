
// THIS APPEARS TO BE DEAD CODE ... see arc-shapes.ts
// @ts-nocheck

import { SupportedArcShapeStrings, isSupportedArcShape } from '../arc-shape';
import { assert } from '../assert';

// Where are dx, dy defined to have value?
// Is this entire file simply here to define a bunch of closures, keyed by SupportedArcShape string?

var to;
var from;
// var lx,
var dx;
var dy;
// var def,
// var Edge;

dx = to.x - from.x;
dy = to.y - from.y;
// lx = ((from.x + to.x) / 2);
// ly = ((from.y + to.y) / 2);

function from_x_y () {
    return from.x + ',' + from.y;
}

function dx_dy () {
    return dx + ', ' + dy;
}

// def = function () {
//     return {
//         style: 'fill:none;stroke:#F00;stroke-width:1'
//     };
// };

export const arcs = {
    // '-': function () { },
    '~' : function () {
        return {
            d: 'M ' + from_x_y() + ' c ' + (0.7 * dx) + ', 0 ' + (0.3 * dx) + ', ' + dy + ' ' + dx_dy()
        };
    },
    '-~': function () {
        // if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.75); }
        return {
            d: 'M ' + from_x_y() + ' c ' + (0.7 * dx) + ', 0 ' +         dx_dy() + ' ' + dx_dy()
        };
    },
    '~-': function () {
        // if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.25); }
        return {
            d: 'M ' + from_x_y() + ' c ' + 0          + ', 0 ' + (0.3 * dx) + ', ' + dy + ' ' + dx_dy()
        };
    },
    '-|': function () {
        // if (Edge.label) { lx = to.x; }
        return {
            d: 'm ' + from_x_y() + ' ' + dx + ',0 0,' + dy
        };
    },
    '|-': function () {
        // if (Edge.label) { lx = from.x; }
        return {
            d: 'm ' + from_x_y() + ' 0,' + dy + ' ' + dx + ',0'
        };
    },
    '-|-': function () {
        return {
            d: 'm ' + from_x_y() + ' ' + (dx / 2) + ',0 0,' + dy + ' ' + (dx / 2) + ',0'
        };
    },
    '->': function () {
        return {
            style: 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none'
        };
    },
    '~>': function () {
        return {
            style: 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none',
            d: 'M ' + from_x_y() + ' ' + 'c ' + (0.7 * dx) + ', 0 ' + 0.3 * dx_dy() + ' ' + dx_dy()
        };
    },
    '-~>': function () {
        // if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.75); }
        return {
            style: 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none',
            d: 'M ' + from_x_y() + ' ' + 'c ' + (0.7 * dx) + ', 0 ' +     dx_dy() + ' ' + dx_dy()
        };
    },
    '~->': function () {
        // if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.25); }
        return {
            style: 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none',
            d: 'M ' + from_x_y() + ' ' + 'c ' + 0      + ', 0 ' + (0.3 * dx) + ', ' + dy + ' ' + dx_dy()
        };
    },
    '-|>' : function () {
        // if (Edge.label) { lx = to.x; }
        return {
            style: 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none',
            d: 'm ' + from_x_y() + ' ' + dx + ',0 0,' + dy
        };
    },
    '|->': function () {
        // if (Edge.label) { lx = from.x; }
        return {
            style: 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none',
            d: 'm ' + from_x_y() + ' 0,' + dy + ' ' + dx + ',0'
        };
    },
    '-|->': function () {
        return {
            style: 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none',
            d: 'm ' + from_x_y() + ' ' + (dx / 2) + ',0 0,' + dy + ' ' + (dx / 2) + ',0'
        };
    },
    '<->': function () {
        return {
            style: 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none'
        };
    },
    '<~>': function () {
        return {
            style: 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none',
            d: 'M ' + from_x_y() + ' ' + 'c ' + (0.7 * dx) + ', 0 ' + (0.3 * dx) + ', ' + dy + ' ' + dx_dy()
        };
    },
    '<-~>': function () {
        // if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.75); }
        return {
            style: 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none',
            d: 'M ' + from_x_y() + ' ' + 'c ' + (0.7 * dx) + ', 0 ' +     dx_dy() + ' ' + dx_dy()
        };
    },
    '<-|>': function () {
        // if (Edge.label) { lx = to.x; }
        return {
            style: 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none',
            d: 'm ' + from_x_y() + ' ' + dx + ',0 0,' + dy
        };
    },
    '<-|->': function () {
        return {
            style: 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none',
            d: 'm ' + from_x_y() + ' ' + (dx / 2) + ',0 0,' + dy + ' ' + (dx / 2) + ',0'
        };
    },
    // 'Fail': function () { return {}; }, // uncomment to validate below will ensure it's all the same
} as const;


// ensure all arcs are in both files
for ( const chk in arcs ) {
    assert( isSupportedArcShape(chk), "ARC defined in arcs.ts fails isSupportedArcShape()" );
    assert( SupportedArcShapeStrings.some( (p : string) => p === chk ), "ARC defined in arcs.ts does not exist in SupportedArcShapeStrings (see arc-shape.ts)");
}
for ( const chk in SupportedArcShapeStrings ) {
    assert( Object.keys(arcs).some( (p : string) => p === chk), "ARC defined in arc-shape.ts is not reflected in arcs.ts");
}

/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
module.exports = {
    arcs: arcs
};

