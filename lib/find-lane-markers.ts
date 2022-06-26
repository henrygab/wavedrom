import { warn_unless } from "./assert";

// lanetext is *probably* of type `string[]`
// better if could explicitly define list of allowed / expected strings
// what do the 'vvv-N' (where N in [2..9]) actually refer to?
export function findLaneMarkers (lanetext : string[] | any[]) {
    let gcount = 0;
    let lcount = 0;
    const ret : number[] = [];

    lanetext.forEach(function (e) {
        warn_unless(typeof e === 'string', `[TS TYPE]: lanetext parameter of findLaneMarkers was *NOT* string, was ${typeof e}`);
        if (
            (e === 'vvv-2') ||
            (e === 'vvv-3') ||
            (e === 'vvv-4') ||
            (e === 'vvv-5') ||
            (e === 'vvv-6') ||
            (e === 'vvv-7') ||
            (e === 'vvv-8') ||
            (e === 'vvv-9')
        ) {
            lcount += 1;
        } else {
            if (lcount !== 0) {
                ret.push(gcount - ((lcount + 1) / 2));
                lcount = 0;
            }
        }
        gcount += 1;

    });

    if (lcount !== 0) {
        ret.push(gcount - ((lcount + 1) / 2));
    }

    return ret;
}

/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
module.exports = findLaneMarkers;
module.exports.findLaneMarkers = findLaneMarkers;
