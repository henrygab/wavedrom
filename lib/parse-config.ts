import { warn_unless } from './assert';
type ArrayOfExactlyTwo<T> = [T, T]

// These types were automatically inferred by TypeScript
type ParseConfigSource = {
    config: {
        hscale: any;             // TODO: consider defining the alternatives?
        hbounds: ArrayOfExactlyTwo<number>;
    };
    head: {
        tick: number;
        tock: number;
        text: any;    // TODO: Discover why this would not be 'string'
    };
    foot: {
        tick: number;
        tock: number;
        text: any;    // TODO: Discover why this would not be 'string'
    };
 };
 type ParseConfigLane = {
    hscale: number;
    hscale0: any;           // TODO: consider if this can be made more specific?
    yh0: number;
    yh1: number;
    head: { text: any; };   // TODO: consider why this would not be 'string'
    xmin_cfg: number;
    xmax_cfg: number;
    yf0: number;
    yf1: number;
    foot: { text: any; };   // TODO: consider why this would not be 'string'
};


function parseConfig (source: ParseConfigSource, lane: ParseConfigLane ) {

    function toNonNegativeInteger(x : number) {
        return x > 0 ? Math.round(x) : 1; // BUGBUG -- If the value is < 0.5, this will round DOWN, resulting in ZERO(!)
    }

    lane.hscale = 1;

    if (lane.hscale0) {
        lane.hscale = lane.hscale0;
    }
    if (source && source.config && source.config.hscale) {
        let hscale = toNonNegativeInteger(source.config.hscale);
        if (hscale > 0) {
            if (hscale > 100) {
                hscale = 100;
            }
            lane.hscale = hscale;
        }
    }
    lane.yh0 = 0;
    lane.yh1 = 0;
    lane.head = source.head;

    lane.xmin_cfg = 0;
    lane.xmax_cfg = 1e12; // essentially infinity
    const hBoundArray = source?.config?.hbounds as ArrayOfExactlyTwo<number>;
    if (hBoundArray != null) { // both undefined and null
        hBoundArray[0] = Math.floor(hBoundArray[0]);
        hBoundArray[1] = Math.ceil(hBoundArray[1]);
        warn_unless(hBoundArray[0] < hBoundArray[1], "WARNING: parseConfig: source.config.hbounds order reversed");
        if (hBoundArray[0] < hBoundArray[1] ) {
            // convert hbounds ticks min, max to bricks min, max
            // TODO: do we want to base this on ticks or tocks in
            //  head or foot?  All 4 can be different... or just 0 reference?
            lane.xmin_cfg = 2 * Math.floor(hBoundArray[0]);
            lane.xmax_cfg = 2 * Math.floor(hBoundArray[1]);
        }
    }

    if (source && source.head) {
        if (
            source.head.tick || source.head.tick === 0 ||
            source.head.tock || source.head.tock === 0
        ) {
            lane.yh0 = 20; // BUGBUG -- What is this magic number?
        }
        // if tick defined, modify start tick by lane.xmin_cfg
        if ( source.head.tick || source.head.tick === 0 ) {
            source.head.tick = source.head.tick + lane.xmin_cfg/2;
        }
        // if tock defined, modify start tick by lane.xmin_cfg
        if ( source.head.tock || source.head.tock === 0 ) {
            source.head.tock = source.head.tock + lane.xmin_cfg/2;
        }

        if (source.head.text) {
            lane.yh1 = 46;  // BUGBUG -- What is this magic number?
            lane.head.text = source.head.text;
        }
    }

    lane.yf0 = 0;
    lane.yf1 = 0;
    lane.foot = source.foot;
    if (source && source.foot) {
        if (
            source.foot.tick || source.foot.tick === 0 ||
            source.foot.tock || source.foot.tock === 0
        ) {
            lane.yf0 = 20; // BUGBUG -- What is this magic number?
        }
        // if tick defined, modify start tick by lane.xmin_cfg
        if ( source.foot.tick || source.foot.tick === 0 ) {
            source.foot.tick = source.foot.tick + lane.xmin_cfg/2;
        }
        // if tock defined, modify start tick by lane.xmin_cfg
        if ( source.foot.tock || source.foot.tock === 0 ) {
            source.foot.tock = source.foot.tock + lane.xmin_cfg/2;
        }

        if (source.foot.text) {
            lane.yf1 = 46; // BUGBUG -- What is this magic number?
            lane.foot.text = source.foot.text;
        }
    }
}

module.exports = parseConfig;
