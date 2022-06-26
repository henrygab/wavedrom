import { assert_for_review, warn_unless } from './assert';
type ArrayOfExactlyTwo<T> = [T, T]


export function isKeyOfObject<T>( key: string | number | symbol, obj: T ) : key is keyof T {
    return (!!obj) && (key in (obj as any));
 }
 
 // these interfaces are NOT exhaustive description of the `config:` options
 // rather, they are what's needed in this file....
 // TODO: There has *GOT* to be a better way to parse unknown objects into known types....
  
 interface IParseConfig_HeaderFooter_tick {
     tick: number;
 }
 function isIParseConfig_HeaderFooter_tick(obj : unknown) : obj is IParseConfig_HeaderFooter_tick {
     return (
         isKeyOfObject('tick', obj) && (typeof((obj as any).tick) === 'number')
     );
 }
 interface IParseConfig_HeaderFooter_tock {
     tock: number;
 }
 function isIParseConfig_HeaderFooter_tock(obj : unknown) : obj is IParseConfig_HeaderFooter_tock {
     return (
         isKeyOfObject('tock', obj) && (typeof((obj as any).tock) === 'number')
     );
 }
 interface IParseConfig_HeaderFooter_text {
     text: NonNullable<any>; // Header and Footer text field can be complex SVG Text Elements ... not defined in this phase
 }
 function isIParseConfig_HeaderFooter_text(obj : unknown) : obj is IParseConfig_HeaderFooter_text {
     return (
         isKeyOfObject('text', obj) && (typeof((obj as any).tick) !== null) && (typeof((obj as any).tick) !== undefined)
     );
 }
 function isIParseConfig_HeaderFooter(obj : unknown) : obj is IParseConfig_HeaderFooter {
     // If the optional keys exist, they must be of the proper type
     if (isKeyOfObject('tick', obj) && !isIParseConfig_HeaderFooter_tick(obj)) return false;
     if (isKeyOfObject('tock', obj) && !isIParseConfig_HeaderFooter_tock(obj)) return false;
     if (isKeyOfObject('text', obj) && !isIParseConfig_HeaderFooter_text(obj)) return false;
     return true;
 }
 interface IParseConfig_HeaderFooter extends
      Partial<IParseConfig_HeaderFooter_tick>,
      Partial<IParseConfig_HeaderFooter_tock>,
      Partial<IParseConfig_HeaderFooter_text>
 {
 }
 
 
 interface IParseConfig_Config_hscale {
     hscale: number;
 }
 function isIParseConfig_Config_hscale(obj : unknown) : obj is IParseConfig_Config_hscale {
     return (
         isKeyOfObject('hscale', obj) && (typeof((obj as any).hscale) === 'number')
     );
 }
 interface IParseConfig_Config_hbounds {
     hbounds: ArrayOfExactlyTwo<number>;
 }
 function isIParseConfig_Config_hbounds(obj : unknown) : obj is IParseConfig_Config_hbounds {
     if (!isKeyOfObject('hbounds', obj)           ) return false;
     if (typeof((obj as any).hbounds) !== 'object') return false;
     const might_be_array : unknown = (obj as any).hbounds;
     if (!Array.isArray(might_be_array)           ) return false;           
     if (might_be_array.length !== 2              ) return false;
     if (typeof might_be_array[0] !== 'number'    ) return false;
     if (typeof might_be_array[1] !== 'number'    ) return false;
     return true;
 }
 function isIParseConfig_Config(obj : unknown) : obj is IParseConfig_Config {
     if (!obj                                                                ) return false; // null / undefined
     // If the optional keys exist, they must be of the proper type
     if (isKeyOfObject('hbounds', obj) && !isIParseConfig_Config_hbounds(obj)) return false;
     if (isKeyOfObject('hscale',  obj) && !isIParseConfig_Config_hscale(obj) ) return false;
     return true;
 }
 interface IParseConfig_Config extends Partial<IParseConfig_Config_hbounds>, Partial<IParseConfig_Config_hscale> {
 }
 

function parseConfig (source: any, lane: any ) {

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

    const hBoundArray = source?.config?.hbounds;
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

    if (source?.head) {
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
    if (source?.foot) {
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
module.exports.parseConfig = parseConfig;
