import { assert, assert_for_review } from "./assert";

import { genFirstWaveBrick } from './gen-first-wave-brick';
import { genWaveBrick      } from './gen-wave-brick';
import { findLaneMarkers   } from './find-lane-markers';

// R is array of half brick types, each is item is string
// num_unseen_markers is how many markers are now unseen due to phase
export type parseWaveLaneResult = [ string[], number ];

// src is the wave member of the signal object
// extra = hscale-1 ( padding )
// lane is an object containing all properties for this waveform
export function parseWaveLane (src : string, extra : number, lane : any) : parseWaveLaneResult {
    const Stack = src.split(''); // one character at a time
    assert_for_review(Stack.length > 0, "Else, would call genFirstWaveBrick(undefined, ...)");
    let Next = Stack.shift();    // Next represents the next character to create symbols for
    assert(Next !== undefined, "Else, Stack.length would have been 0");
    let Repeats = 1;             // how many times will this symbol 
    let subCycle = false;

    var i;

    while (Stack[0] === '.' || Stack[0] === '|') { // repeaters parser
        Stack.shift();
        Repeats += 1;
    }
    let R : string[] = [];
    R = R.concat(genFirstWaveBrick(Next, extra, Repeats));

    while (Stack.length) {
        const Top = Next;
        assert_for_review(Top !== undefined, "Top cannot be null, else Stack.length would have been zero");
        Next = Stack.shift();
        if (Next === '<') { // sub-cycles on
            subCycle = true;
            Next = Stack.shift();
        }
        if (Next === '>') { // sub-cycles off
            subCycle = false;
            Next = Stack.shift();
        }
        Repeats = 1;
        while (Stack[0] === '.' || Stack[0] === '|') { // repeaters parser
            Stack.shift();
            Repeats += 1;
        }
        if (subCycle) {
            R = R.concat(genWaveBrick((Top + Next), 0,     Repeats - lane.period));
        } else {
            R = R.concat(genWaveBrick((Top + Next), extra, Repeats              ));
        }
    }

    const unseen_bricks : string[] = []
    let   num_unseen_markers = 0;
    // shift out unseen bricks due to phase shift, and save them in
    // unseen_bricks array
    for (i = 0; i < lane.phase; i += 1) {
        const potentiallyUnseen = R.shift();
        if (potentiallyUnseen !== undefined) {
            unseen_bricks.push(potentiallyUnseen);
        }
    }
    if (unseen_bricks.length > 0) {
        num_unseen_markers = findLaneMarkers( unseen_bricks ).length;
        // if end of unseen_bricks and start of R both have a marker,
        //  then one less unseen marker
        if ( findLaneMarkers( [unseen_bricks[unseen_bricks.length-1]] ).length == 1 &&
             findLaneMarkers( [R[0]] ).length == 1 ) {
            num_unseen_markers -= 1;
        }
    } else {
        num_unseen_markers = 0;
    }

    // R is array of half brick types, each is item is string
    // num_unseen_markers is how many markers are now unseen due to phase
    return [R, num_unseen_markers];
}

module.exports = parseWaveLane;
module.exports.parseWaveLane = parseWaveLane;
