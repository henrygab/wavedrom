
export function assert(
    /* eslint-disable @typescript-eslint/no-explicit-any */
    condition: any,
    /* eslint-enable  @typescript-eslint/no-explicit-any */
    msg?: string
    ): asserts condition {
    if (!condition) {
        throw ( "ASSERT FAILED: " + msg );
    }
}
