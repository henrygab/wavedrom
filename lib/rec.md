

# rec.ts

## rec( waveDromSignalScript : any, startState : any ) : recResult

The `rec()` function converts the hierarchical `signal` portion of a WaveDrom script
into a flat set of arrays of independent parts.

A single array stores metadata for each lane  (regardless of how it was grouped in the script)
A single array stores metadata for each group (regardless of how it was ordered in the script)

Breaking it down this way allows later functions to just loop through those arrays,
placing the corresponding SVG parts using only a array index's metadata.
(no need to review the original WaveDrom script).

The `width` array appears to be a running count (i.e., during recursion) of the minimum
offsets required to have enough space for any group diagrams (& their labels).
There is a possibility that the `width` array can also be dropped from the output object.

## Input : waveDromSignalScript

This first parameter is the entirety of the `signal` portion of the WaveDrom script.
It's a fairly complex structure, with hierarchical arrangement (to allow labeled
groups of signals).

If the parameter type is named `SignalInput`, then the definition is generally:
The first parameter is always an array (even if it's an empty array).

The first element of the array could be a string.  At the highest level, the
string is ignored.  At any recursive depth, it becomes the name applied to
the subgroupIf the element.  The remaining elements of the array could be:
1. an empty object `{}`, representing an empty `lane` (e.g., for space between signals)
2. an object representing a single `lane` of signal
3. an array, recursively defined as same this same type, representing a group of signals  

See https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#more-recursive-type-aliases.

## Input : state

Originally, initial state was provided by the caller, and
mutated within the function, before also being returned
as the result.

However, it was *always* initialized to the following object:
```ts
{'x':0, 'y':0, 'xmax':0, 'width':[], 'lanes':[], 'groups':[]}
```

Also, note that this does *NOT* include the `'xx': 0`
property, which appears to only be used to track state
internally during recursion.

Based on the above, this argument should be removed from
the rec() function.  Instead, the rec() function should
be a slim wrapper to the current, recursive function,
which then builds the type-safe result.

## Output : state

The type-safe output has the following form:

A number of `laneInfo` structures, which contain the following
fields.  Of note, previously the `data` field could be returned
as either a single, space-separated string, or as an array
of strings.  This should be changed to ALWAYS return an array
of strings, to simplify later code.

```ts
type laneInfo = { // yes, every field is optional.  require the field to exist, but allow value to be null
    name      : string   | null,
    wave      : string   | null,
    data      : string[]       ,
    phase     : number   | null,
    period    : number   | null,
    xOffset   : number         , // was: state.x ... 
}
```

## Historical notes

The output of all test cases in test.html showed the following characteristics:
```ts
    state.x                = 0;
    state.y     : number   = count_of_lanes_and_width_arrays;
    state.xmax             = 0;
    state.width : number[]; // ??? state for recursion ???
```

## Code that might be put into `rec.ts` ... 


```ts
// input: WaveDrom script 'signal' object

type groupInfo = {
    x         : number,        // x offset to place group SVG element at
    y         : number,        // y offset to place group SVG element at
    laneCount : number,        // was '.height'
    name      : string | null, // if it's null, then no name exists
};
// Yes, every property is optional.
// Define the type as REQUIRING all fields, to simplify later code.
// Allow each field to indicate it's not used for this lane, by either:
// * storing `null` (for scalar values)
// * storing a zero-length array (for arrays)
type laneInfo = {
    name      : string   | null,
    wave      : string   | null,
    data      : string[], // CHANGE: input is allowed as EITHER a single, space-separated string, or array of strings
                          // used to store whatever was input ... but now should split the input so can validate it
                          // it's length <= the wave string's length.  OK to use spare arrays here!
                          // both '=' and digits 0-9 get a corresponding label...
    phase     : number   | null,
    period    : number   | null,
    xOffset   : number,

}
type recResult = {
    lanes     : laneInfo  [/* length === this.y */],
    groups    : groupInfo [/* */],

    width     : number    [/* length === this.y */], // likely not needed, once the object is constructed....
    xx        : number,    // ??? was '.xx' ... was ten (10) for all 23 main test scripts ???
    x         : number,    // ??? was zero (0) for all 23 main test scripts ???
    laneCount : number,    // ??? was '.y' ... can this simply be lanes.length ???
    xmax      : number,    // ??? was zero (0) for all 23 main test scripts ???
};

// TODO: define the OUTPUT (_not_ the input) ... to get type safety *after* this is called.
// 
// NOTE: Currently, the function directly modifies the object 'state'.
// tmp === empty object | signal (aka string) | signal[] (aka string[])
```