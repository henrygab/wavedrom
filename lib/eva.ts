/* eslint-env browser */
/* eslint no-console: 0 */
import { assert, assert_for_review, warn_unless } from './assert';


//import * as G from './typeguard';
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace G {
// See: https://stackoverflow.com/a/72668047/6471040
// See: https://stackoverflow.com/a/59483318/6471040
// (CC BY-SA 4.0 ... https://creativecommons.org/licenses/by-sa/4.0/)
// 
// Guard<T> is used below to ensure, when an object has a property,
//          that the type of the property is of type 'T'
//
export type Guard<T> = (x: unknown) => x is T;
// Guarded<T> is never used??
export type Guarded<T extends Guard<unknown>> = T extends Guard<infer V> ? V : never;
// primitiveGuard provides a wrapper for gString, gNumber, gBoolean
const primitiveGuard = <T>(typeOf: string) => (x: unknown): x is T => typeof x === typeOf;
export const gString = primitiveGuard<string>("string");
export const gNumber = primitiveGuard<number>("number");
export const gBoolean = primitiveGuard<boolean>("boolean");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const gNull = (x: any): x is null => x === null;
// gObject<T> 
export const gObject = <T extends object>(
    // propGuardObj has literal strings matching T's properties
    // Each of which has the same type as the defined property.
    // in other words, magical generics to setup a type-safe
    // dummy object to compare against....
    propGuardObj: { [K in keyof T]: Guard<T[K]> }
) =>
    // the actual function takes 'x' as type 'any'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (x: any): x is T => (
        // must be an object (and not null)
        typeof x === "object" && x !== null &&
        // for each of the keys (properties) of the dummy object
        (Object.keys(propGuardObj) as Array<keyof T>)
            // key must be in object, AND be of matching type
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            .every( k => (k in x) && propGuardObj[k](x[k]) )
        );
export const gPartial = <T extends object>(
        propGuardObj: { [K in keyof T]: Guard<T[K]> }
) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (x: any): x is { [K in keyof T]? : T[K] } => (
        typeof x === "object" &&
        x !== null &&
        (Object.keys(propGuardObj) as Array<keyof T>)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            .every( k => !(k in x) || typeof x[k] === "undefined" || propGuardObj[k](x[k]) )
    );

export const gArray =
    <T>(elemGuard: Guard<T>) => (x: unknown): x is Array<T> => (
        Array.isArray(x) &&
        x.every(el => elemGuard(el))
    );
export const gUnion = <T, U>(tGuard: Guard<T>, uGuard: Guard<U>) =>
    (x: unknown): x is T | U =>
        tGuard(x) || uGuard(x);

export const gIntersection = <T, U>(tGuard: Guard<T>, uGuard: Guard<U>) =>
    (x: unknown): x is T & U =>
        tGuard(x) && uGuard(x);

}


// Using typeguard helpers, define each type, so it's available at runtime
const _gWavedromMinimal_Signal_v1 = G.gObject({ signal : G.gArray(G.gObject({})) });
const _gWavedromMinimal_Assign_v1 = G.gObject({ assign : G.gArray(G.gObject({})) });
const _gWavedromMinimal_Reg_v1    = G.gObject({ reg    : G.gArray(G.gObject({})) });
// Using typeguard helpers, define the interface using the typeguard types
// was originally:
//     interface IFoo extends G.Guarded<typeof _gWavedromMinimal_Signal_v1> {};
// but this results in ESLint error:
//     An interface declaring no members is equivalent to its supertype.
//     eslint@typescript-eslint/no-empty-interface
// which ESLint auto-fixes to the below (type alias)
type  IWavedromMinimal_Signal_v1  = G.Guarded<typeof _gWavedromMinimal_Signal_v1>;
type  IWavedromMinimal_Assign_v1  = G.Guarded<typeof _gWavedromMinimal_Assign_v1>;
type  IWavedromMinimal_Reg_v1     = G.Guarded<typeof _gWavedromMinimal_Reg_v1>;
// 
type Validator_v1 = {
    hasSignal  : G.Guard<IWavedromMinimal_Signal_v1>;
    hasAssign  : G.Guard<IWavedromMinimal_Assign_v1>;
    hasReg     : G.Guard<IWavedromMinimal_Reg_v1>;
}
const validator : Validator_v1 = {
    hasSignal : _gWavedromMinimal_Signal_v1,
    hasAssign : _gWavedromMinimal_Assign_v1,
    hasReg    : _gWavedromMinimal_Reg_v1,
};
type  IWavedromMinimal_v1 =
    IWavedromMinimal_Signal_v1 |
    IWavedromMinimal_Assign_v1 |
    IWavedromMinimal_Reg_v1    ;
function isIWavedromMinimal_v1(obj: unknown) : obj is IWavedromMinimal_v1 {
    return (
        validator.hasSignal(obj) ||
        validator.hasAssign(obj) ||
        validator.hasReg   (obj)
        );
}
function newValidation(obj : unknown) : string | null {
    if (!isIWavedromMinimal_v1(obj)) {
        return '[Semantic]: "signal:[...]" or "assign:[...]" or "reg:[]" property is missing inside the root Object';
    }
    return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function originalValidation(obj : any) : string | null {
    // What these next lines are doing is trying to validate the type.
    // Specifically, the resulting object must:
    // 1. cannot be null
    // 2. be an object (not string / boolean / number)
    // 3. have at least one of 'signal', 'assign', or 'reg' properties
    //    where that property is an array (of any type)
    if (obj === null) {
        return '[Semantic]: The object was null';
    }
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
        return '[Semantic]: The root has to be an Object: "{signal:[...]}"';
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (obj.signal) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (Object.prototype.toString.call(obj.signal) !== '[object Array]') {
            return '[Semantic]: "signal" object has to be an Array "signal:[]"';
        }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    } else if (obj.assign) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (Object.prototype.toString.call(obj.assign) !== '[object Array]') {
            return '[Semantic]: "assign" object has to be an Array "assign:[]"';
        }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    } else if (obj.reg) {
        // test register
    } else {
        return '[Semantic]: "signal:[...]" or "assign:[...]" or "reg:[]" property is missing inside the root Object';
    }
    return null;
}

// TODO: Define the return type from this function...
function erra (e : Error | string) {
    console.log('Error in WaveJS: ', e);
    // NOTE: next line is any, until can define type so `msg.textWidth` can be assigned
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msg : any = ['tspan', ['tspan', {class:'error h5'}, 'Error: '], e];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    msg.textWidth = 1000;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = { signal: [{ name: msg }]};
    warn_unless(isIWavedromMinimal_v1(result), "erra: result does not conform to IWavedromMinimal_v1?!");
    return result;
}

// TODO: provide stricter guarantees for the type returned by this function
//       e.g., it should ensure at least: IWavedromMinimal_v1 | { signal: { name : string } }
export function eva (id : string) : object {
    const el : HTMLElement | null = document.getElementById(id);
    assert_for_review(el);
    const TheTextBox : HTMLTextAreaElement | null = (el instanceof HTMLTextAreaElement) ? el : null;

    let source : unknown;
    try {
        const textToConvertToObject = '(' + ((null != TheTextBox) ? TheTextBox.value : el.innerHTML) + ')';
        /* eslint-enable  no-eval */
        source = eval( textToConvertToObject );
        /* eslint-enable  no-eval */
    } catch (e : unknown) {
        const err  =
            (e instanceof Error) ? e :
            new Error(e === "string" ? e : 'Unknown exception type');
        return erra(err);
    }
    const failure1 = originalValidation(source);
    const failure2 = newValidation(source);
    if (null !== failure1) {
        warn_unless(null === failure2, "New validation too lenient");
    } else {
        warn_unless(null !== failure2, "New validation too strict");
    }

    if (failure1 !== null) {
        return erra(failure1);
    }

    assert(isIWavedromMinimal_v1(source));
    return source;
}

/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
module.exports = eva;

