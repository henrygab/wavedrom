import { assert_for_review } from "./assert";

// TODO: Decode purpose of function, and how the arguments inter-relate
function genBrick (texts: string[], extra: number, times: number) {

    const R : string[] = [];
    assert_for_review(texts.length > 0, "If not, then `R.push(texts[0])` below (outside if blocks) would have pushed undefined onto R");

    // texts has four elements, 
    if (texts.length === 4) {
        for (let j = 0; j < times; j += 1) {
            R.push(texts[0]);
            for (let i = 0; i < extra; i += 1) {
                R.push(texts[1]);
            }
            R.push(texts[2]);
            for (let i = 0; i < extra; i += 1) {
                R.push(texts[3]);
            }
        }
        return R;
    }
    if (texts.length === 1) { // ensure there are at least two elements
        texts.push(texts[0]);
    }
    R.push(texts[0]);
    for (let i = 0; i < (times * (2 * (extra + 1)) - 1); i += 1) {
        R.push(texts[1]);
    }
    return R;
}

module.exports = genBrick;
module.exports.genBrick = genBrick;
