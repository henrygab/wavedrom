// THIS APPEARS TO BE DEAD CODE ... see arc-shapes.ts

var to;
var from;
// var lx,
var dx,
var dy;
// var def,
// var Edge;

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

var arcs = {
    '-': function () {
        return {
            style: 'fill:none;stroke:#F00;stroke-width:1'
        };
    },
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
    }
};

export function arc (str : string, ifrom, ito) {
    from = ifrom;
    to = ito;
    dx = to.x - from.x;
    dy = to.y - from.y;
    var target = arcs[str] || arcs['->'];
    return target();
}

/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
module.exports = arc;
