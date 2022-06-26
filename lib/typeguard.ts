
// See: https://stackoverflow.com/a/72668047/6471040
// See: https://stackoverflow.com/a/59483318/6471040
// (CC BY-SA 4.0 ... https://creativecommons.org/licenses/by-sa/4.0/)
// 
// Guard<T> is used below to ensure, when an object has a property,
//          that the type of the property is of type 'T'
//

// BUGBUG -- this is a minimal and knowingly incomplete implementation.
//           It should be removed / replaced with a better solutions
//           that simplifies creating typeguards for interfaces.

/* SCENARIO:

Let's say you have an interface `IFoo`, and you want to generate
typeguards to safely determine if an `unknown` object can be safely
cast to that interface at run-time.

Normally, you'd use a TypeGuard function, or use `instanceof`,
to constrain the `unknown` object to the more-specific type.

This is problematic, because interfaces exist only in TypeScript,
and disappear entirely by the time it's executed as JavaScript.
Thus, there really isn't a built-in way (currently) to have this
__run-time__  validation that an object matched (duck-type) any
given interface.

One solution is to declare a class, so that the type information
is retained in the compiled form, and use some template magic to
automatically generate appropriate validation functionality.


Example interfaces:

interface IFooAssign {
    assign : { object[] }
};
interface IFooSignal {
    signal : { object[] }
};

The container must be an object, but otherwise might
be empty.  If it contains members of 'signal' or 'assign',
then those members must be arrays of objects.

interface IFooContainer extends Optional<IFooAssign>,  Optional<IFooSignal> {}
*/
/* DEFINING INTERFACE TYPEGUARDS:

// Scenario is close to the following, but requires AT LEAST one of the fields to exist:
// interface IFoo {
//    signal? : unknown[];
//    assign? : unknown[];
//    reg?    : unknown[];
// }


import * as G from './typeguard';

// each of these corresponds to a Record<string, object[]>
const _gWavedromMinimal_Signal_v1 = G.gObject({ signal : G.gArray(G.gObject({})) });
const _gWavedromMinimal_Assign_v1 = G.gObject({ assign : G.gArray(G.gObject({})) });
const _gWavedromMinimal_Reg_v1    = G.gObject({ reg    : G.gArray(G.gObject({})) });

// Use the types defined above to automagically generate the corresponding interface
type  IWavedromMinimal_Signal_v1  = G.Guarded<typeof _gWavedromMinimal_Signal_v1>;
type  IWavedromMinimal_Assign_v1  = G.Guarded<typeof _gWavedromMinimal_Assign_v1>;
type  IWavedromMinimal_Reg_v1     = G.Guarded<typeof _gWavedromMinimal_Reg_v1>;

// I'll define a validator type, simply to logically associate three TypeGuard functions
const Validator_v1 = {
    hasSignal : G.Guard< IWavedromMinimal_Signal_v1 >; // this is a TypeGuard function
    hasAssign : G.Guard< IWavedromMinimal_Assign_v1 >; // this is a TypeGuard function
    hasReg    : G.Guard< IWavedromMinimal_Reg_v1    >; // this is a TypeGuard function
};

// A WaveDrom script is valid if it has at least one of these three fields.
// It can, of course, have more than one of these....
type IWaveDromMinimal_v1 =
    | IWavedromMinimal_Signal
    | IWavedromMinimal_Assign
    | IWavedromMinimal_Reg
    ;
// The TypeGuard to validate the script as a whole is then:
function isIWavedromMinimal_v1(obj: unknown) : obj is IWavedromMinimal_v1 {
    return (
        validator.hasSignal(obj) ||
        validator.hasAssign(obj) ||
        validator.hasReg   (obj)
        );
}

*/
/* USAGE ONCE DEFINED

maybeValid : uknown = ...; // e.g., result of eval() or JSON.parse()

if (!isIWavedromMinimal_v1(maybeValid)) {
    return "Error Message"
}
// Typescript should now show the type of 'maybeValid' as IWaveDromMinimal_v1
if (validator.hasSignal(maybeValid)) {
    let signal = validator.signal; // TypeScript knows it's safe to access this property now
}
if (validator.hasAssign(maybeValid)) {
    let assign = validator.signal; // TypeScript will catch this copy/paste error
}
if (validator.hasReg   (maybeValid)) {
    let reg    = validator.reg;    // TypeScript knows it's safe to access this property now
}

*/

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

