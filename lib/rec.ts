import { assert_for_review } from "./assert";

function rec (tmp, state) {
    var i;
    var name;
    var delta = {'x':10};
    let oldY = 0;
    if (typeof tmp[0] === 'string' || typeof tmp[0] === 'number') {
        name = tmp[0];
        delta.x = 25;
    }
    state.x += delta.x;
    for (i = 0; i < tmp.length; i++) {
        if (typeof tmp[i] === 'object') {
            if (Object.prototype.toString.call(tmp[i]) === '[object Array]') {
                oldY = state.y ?? 0;
                state = rec(tmp[i], state);
                state.groups.push({'x':state.xx, 'y':oldY, 'height':(state.y - oldY), 'name':state.name});
            } else {
                state.lanes.push(tmp[i]);
                state.width.push(state.x);
                state.y += 1;
            }
        }
    }
    state.xx = state.x;
    state.x -= delta.x;
    state.name = name;
    return state;
}

module.exports = rec;
module.exports.rec  = rec;
