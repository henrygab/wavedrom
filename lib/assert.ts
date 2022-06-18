
export function assert(
    /* eslint-disable @typescript-eslint/no-explicit-any */
    condition: any,
    /* eslint-enable  @typescript-eslint/no-explicit-any */
    msg?: string
    ): asserts condition
{
    if (!condition) {
        throw ( "ASSERT FAILED: " + msg );
    }
}

// use assert_for_review temporarily, for assertions which may not have been fully validated
export function assert_for_review(
    /* eslint-disable @typescript-eslint/no-explicit-any */
    condition: any,
    /* eslint-enable  @typescript-eslint/no-explicit-any */
    msg?: string
    ): asserts condition
{
    if (!condition) {
        throw ( "ASSERT FAILED: " + msg );
    }
}


export function assert_unreachable(
    /* eslint-disable @typescript-eslint/no-unused-vars */
    _: never
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ): never
{
    throw new Error("Statement should be unreachable");
}
