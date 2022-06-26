
import { arcs } from './archive/arcs';
import { assert_unreachable, warn_unless } from './assert';

export type ArcShapeResult = {
    lx    : number;        // lengthX
    ly    : number;        // lengthY
    d     : string | null; // SVG shape string, so not easy to make more specific
    style : string | null; // SVG shape string, so not easy to make more specific
};

// Define all the valid arc shapes
export const SupportedArcShapeStrings = [
    '-'     ,  '->'    ,  '<->'   ,   // missing            '<-'
    '|-'    ,  '|->'   ,              // missing '<|->' and '<|-'
    '-|'    ,  '-|>'   ,  '<-|>'  ,   // missing            '<-|'
    '-|-'   ,  '-|->'  ,  '<-|->' ,   // missing            '<-|-'
    '~'     ,  '~>'    ,  '<~>'   ,   // missing            '<~'
    '~-'    ,  '~->'   ,              // missing '<~->' and '<~-'
    '-~'    ,  '-~>'   ,  '<-~>'  ,   // missing            '<-~'
    '+'     ,
] as const;
export type SupportedArcShapes = typeof SupportedArcShapeStrings[number]; // [number] is required here
export function isSupportedArcShape(shape : unknown) : shape is SupportedArcShapes {
    if (typeof(shape) !== 'string') { return false; }
    return SupportedArcShapeStrings.some(p => p === shape);
}
export interface IWaveDromPoint {
    x : number;
    y : number;
}



/* eslint complexity: [warn, 32] */
export function arcShape (shape : SupportedArcShapes | string, from: IWaveDromPoint, to: IWaveDromPoint, label? : string) : ArcShapeResult {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    let   lx = ((from.x + to.x) / 2); // lx is changed in some cases, when there is a label
    const ly = ((from.y + to.y) / 2);
    
    let d     : string | null = null; // line definition
    let style : string | null = null; // style (start & end shapes)

    if (!isSupportedArcShape(shape)) {

        // explicitly handle shape strings that are not in allowed list
        // Using this type guard function allows the else block to be
        // validated by the compiler to cover every supported arch shape.
        // see assert_unreachable() in default case, below
        // Note the default stroke is bright red, so it's at least
        // visually obvious in the resulting graph.
        warn_unless(false, "Unsupported arc shape: ${shape}");
        style = ('fill:none;stroke:#F00;stroke-width:1');        

    } else {

        switch (shape) {
        case '-'  : {
            break;
        }
        case '~'  : {
            d = ('M ' + from.x.toString() + ',' + from.y.toString() + ' c ' + (0.7 * dx).toString() + ', 0 ' + (0.3 * dx).toString() + ', ' + dy.toString() + ' ' + dx.toString() + ', ' + dy.toString());
            break;
        }
        case '-~' : {
            d = ('M ' + from.x.toString() + ',' + from.y.toString() + ' c ' + (0.7 * dx).toString() + ', 0 ' +         dx.toString() + ', ' + dy.toString() + ' ' + dx.toString() + ', ' + dy.toString());
            if (label) { lx = (from.x + (to.x - from.x) * 0.75); }
            break;
        }
        case '~-' : {
            d = ('M ' + from.x.toString() + ',' + from.y.toString() + ' c ' +         '0'           + ', 0 ' + (0.3 * dx).toString() + ', ' + dy.toString() + ' ' + dx.toString() + ', ' + dy.toString());
            if (label) { lx = (from.x + (to.x - from.x) * 0.25); }
            break;
        }
        case '-|' : {
            d = ('m ' + from.x.toString() + ',' + from.y.toString() + ' '   + dx.toString() + ',0 0,' + dy.toString());
            if (label) { lx = to.x; }
            break;
        }
        case '|-' : {
            d = ('m ' + from.x.toString() + ',' + from.y.toString() + ' 0,' + dy.toString() + ' ' + dx.toString() + ',0');
            if (label) { lx = from.x; }
            break;
        }
        case '-|-': {
            d = ('m ' + from.x.toString() + ',' + from.y.toString() + ' '   + (dx / 2).toString() + ',0 0,' + dy.toString() + ' ' + (dx / 2).toString() + ',0');
            break;
        }
        case '->' : {
            style = ('marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
            break;
        }
        case '~>' : {
            style = ('marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
            d = ('M ' + from.x.toString() + ',' + from.y.toString() + ' ' + 'c ' + (0.7 * dx).toString() + ', 0 ' + (0.3 * dx).toString() + ', ' + dy.toString() + ' ' + dx.toString() + ', ' + dy.toString());
            break;
        }
        case '-~>': {
            style = ('marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
            d = ('M ' + from.x.toString() + ',' + from.y.toString() + ' ' + 'c ' + (0.7 * dx).toString() + ', 0 ' +         dx.toString() + ', ' + dy.toString() + ' ' + dx.toString() + ', ' + dy.toString());
            if (label) { lx = (from.x + (to.x - from.x) * 0.75); }
            break;
        }
        case '~->': {
            style = ('marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
            d = ('M ' + from.x.toString() + ',' + from.y.toString() + ' ' + 'c ' + '0'    + ', 0 ' + (0.3 * dx).toString() + ', ' + dy.toString() + ' ' + dx.toString() + ', ' + dy.toString());
            if (label) { lx = (from.x + (to.x - from.x) * 0.25); }
            break;
        }
        case '-|>' : {
            style = ('marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
            d = ('m ' + from.x.toString() + ',' + from.y.toString() + ' ' + dx.toString() + ',0 0,' + dy.toString());
            if (label) { lx = to.x; }
            break;
        }
        case '|->' : {
            style = ('marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
            d = ('m ' + from.x.toString() + ',' + from.y.toString() + ' 0,' + dy.toString() + ' ' + dx.toString() + ',0');
            if (label) { lx = from.x; }
            break;
        }
        case '-|->': {
            style = ('marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
            d = ('m ' + from.x.toString() + ',' + from.y.toString() + ' ' + (dx / 2).toString() + ',0 0,' + dy.toString() + ' ' + (dx / 2).toString() + ',0');
            break;
        }
        case '<->' : {
            style = ('marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none');
            break;
        }
        case '<~>' : {
            style = ('marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none');
            d = ('M ' + from.x.toString() + ',' + from.y.toString() + ' ' + 'c ' + (0.7 * dx).toString() + ', 0 ' + (0.3 * dx).toString() + ', ' + dy.toString() + ' ' + dx.toString() + ', ' + dy.toString());
            break;
        }
        case '<-~>': {
            style = ('marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none');
            d = ('M ' + from.x.toString() + ',' + from.y.toString() + ' ' + 'c ' + (0.7 * dx).toString() + ', 0 ' +     dx.toString() + ', ' + dy.toString() + ' ' + dx.toString() + ', ' + dy.toString());
            if (label) { lx = (from.x + (to.x - from.x) * 0.75); }
            break;
        }
        case '<-|>' : {
            style = ('marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none');
            d = ('m ' + from.x.toString() + ',' + from.y.toString() + ' ' + dx.toString() + ',0 0,' + dy.toString());
            if (label) { lx = to.x; }
            break;
        }
        case '<-|->': {
            style = ('marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none');
            d = ('m ' + from.x.toString() + ',' + from.y.toString() + ' ' + (dx / 2).toString() + ',0 0,' + dy.toString() + ' ' + (dx / 2).toString() + ',0');
            break;
        }
        case '+':   {
            style = ('marker-end:url(#tee);marker-start:url(#tee);fill:none;stroke:#00F;stroke-width:1');
            break;
        }
        
        default: {
            assert_unreachable(shape);
            break;
        } // ensures all SupportedArcShapes values are individually handled above
        } // end switch(shape)
    } // endif
    return {
        'lx': lx,
        'ly': ly,
        'd': d,
        'style': style
    };
}

module.exports = arcShape;
module.exports.arcShape = arcShape;
