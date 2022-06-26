
import { genBrick } from './gen-brick';

// TODO: this appears to (accidentally) define the list of allowed characters
//       in a signal.  It would be nice to have more descriptive names
//       reflecting what each variable / associative array actually does.
// TODO: Remove all the 'Record<string,string>' type specifiers.
//       Instead, define allowed types for keys (and values) in x1..6 and y1..2.
//       See 'G' namespace that is currently in eva.ts for guard-generation functions.

export function genWaveBrick (text : string, extra : number, times : number) : string[] {
    // atext's values (from incoming parameter 'text') are looked up in both x1 and x4
    // the values in x1 correspond to template ids in the skin.js files.
    const x1 : Record<string,string> = {p:'pclk', n:'nclk', P:'Pclk', N:'Nclk', h:'pclk', l:'nclk', H:'Pclk', L:'Nclk'};
    
    const x2 : Record<string,string> = {
        '0':'0', '1':'1',
        'x':'x',
        'd':'d',
        'u':'u',
        'z':'z',
        '=':'v',  '2':'v',  '3':'v',  '4':'v', '5':'v', '6':'v', '7':'v', '8':'v', '9':'v'
    };

    const x3 : Record<string,string> = {
        '0': '', '1': '',
        'x': '',
        'd': '',
        'u': '',
        'z': '',
        '=':'-2', '2':'-2', '3':'-3', '4':'-4', '5':'-5', '6':'-6', '7':'-7', '8':'-8', '9':'-9'
    };

    const y1 : Record<string,string> = {
        'p':'0', 'n':'1',
        'P':'0', 'N':'1',
        'h':'1', 'l':'0',
        'H':'1', 'L':'0',
        '0':'0', '1':'1',
        'x':'x',
        'd':'d',
        'u':'u',
        'z':'z',
        '=':'v', '2':'v', '3':'v', '4':'v', '5':'v', '6':'v', '7':'v', '8':'v', '9':'v'
    };

    const y2 : Record<string,string> = {
        'p': '', 'n': '',
        'P': '', 'N': '',
        'h': '', 'l': '',
        'H': '', 'L': '',
        '0': '', '1': '',
        'x': '',
        'd': '',
        'u': '',
        'z': '',
        '=':'-2', '2':'-2', '3':'-3', '4':'-4', '5':'-5', '6':'-6', '7':'-7', '8':'-8', '9':'-9'
    };

    // atext's values (from incoming parameter 'text') are looked up in both x1 and x4
    // the values in x4 correspond to template ids in the skin.js files.
    const x4 : Record<string,string> = {
        'p': '111', 'n': '000',
        'P': '111', 'N': '000',
        'h': '111', 'l': '000',
        'H': '111', 'L': '000',
        '0': '000', '1': '111',
        'x': 'xxx',
        'd': 'ddd',
        'u': 'uuu',
        'z': 'zzz',
        '=': 'vvv-2', '2': 'vvv-2', '3': 'vvv-3', '4': 'vvv-4', '5': 'vvv-5', '6':'vvv-6', '7':'vvv-7', '8':'vvv-8', '9':'vvv-9'
    };

    const x5 : Record<string,string> = {
        p:'nclk', n:'pclk', P:'nclk', N:'pclk'
    };

    const x6 : Record<string,string> = {
        p: '000', n: '111', P: '000', N: '111'
    };

    const xclude : Record<string,string> = {
        'hp':'111', 'Hp':'111', 'ln': '000', 'Ln': '000', 'nh':'111', 'Nh':'111', 'pl': '000', 'Pl':'000'
    };

    const atext = text.split('');
    //if (atext.length !== 2) { return genBrick(['xxx'], extra, times); }

    const tmp0 = x4[ atext[1] ]; // what does this represent?
    const tmp1 = x1[ atext[1] ]; // what does this represent?
    if (tmp1 === undefined) {
        const tmp2 = x2[atext[1]];
        if (tmp2 === undefined) {
            // unknown
            return genBrick(['xxx'], extra, times);
        } else {
            const tmp3 = y1[atext[0]];
            if (tmp3 === undefined) {
                // unknown
                return genBrick(['xxx'], extra, times);
            }
            // soft curves
            return genBrick([tmp3 + 'm' + tmp2 + y2[atext[0]] + x3[atext[1]], tmp0], extra, times);
        }
    } else {
        const tmp4 = (xclude[text] !== undefined) ? xclude[text] : tmp1;
        // sharp curves
        const tmp2 = x5[atext[1]];
        if (tmp2 === undefined) {
            // hlHL
            return genBrick([tmp4, tmp0], extra, times);
        } else {
            // pnPN
            return genBrick([tmp4, tmp0, tmp2, x6[atext[1]]], extra, times);
        }
    }
}

module.exports = genWaveBrick;
module.exports.genWaveBrick = genWaveBrick;
