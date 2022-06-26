
// TODO: Can I easily make these immutable?  If so, how?

export type TestSource =
    | 'Tutorial1'
    | 'Tutorial2'
    | 'test.html'
    | 'other'
    ;

export class ScriptTestCase {
    constructor(
        readonly source: TestSource,    // a test file that this would have originally belonged to; useful for filtering
        readonly discriminator: string, // in combination with 'source', should be a unique value
        readonly desc: string,          // user-friendly description of the test case
        readonly script: unknown        // the WaveDrom script to be parsed
        ) {
        // 
    };
};

function GenerateGreyCode(bits : number, ticks : number) : unknown {
    var i, t, gray, state, data = [], arr = [];
    for (i = 0; i < bits; i++) {
        arr.push({name: i + '', wave: ''});
        state = 1;
        for (t = 0; t < ticks; t++) {
            data.push(t + '');
            gray = (((t >> 1) ^ t) >> i) & 1;
            arr[i].wave += (gray === state) ? '.' : gray + '';
            state = gray;
        }
    }
    arr.unshift('gray');
    return { signal: [ {name: 'bin', wave: '='.repeat(ticks), data: data}, arr ]};
}
const tutorial1_wavedrom_scripts : readonly ScriptTestCase[] = [
    {   source: 'Tutorial1', discriminator: 'Step 1', desc: 'The Signal',
        script: { signal: [{ name: "Alfa", wave: "01.zx=ud.23.456789" }] },
    },
    {   source: 'Tutorial1', discriminator: 'Step 2', desc: 'Adding Clock',
        script: {
            signal: [
                { name: "pclk", wave: 'p.......' },
                { name: "Pclk", wave: 'P.......' },
                { name: "nclk", wave: 'n.......' },
                { name: "Nclk", wave: 'N.......' },
                {},
                { name: 'clk0', wave: 'phnlPHNL' },
                { name: 'clk1', wave: 'xhlhLHl.' },
                { name: 'clk2', wave: 'hpHplnLn' },
                { name: 'clk3', wave: 'nhNhplPl' },
                { name: 'clk4', wave: 'xlh.L.Hx' },
            ],
        },
    },
    {   source: 'Tutorial1', discriminator: 'Step 3', desc: 'Putting It All Together',
        script: {
            signal: [
                { name: "clk",  wave: "P......",                                        },
                { name: "bus",  wave: "x.==.=x", data: ["head", "body", "tail", "data"] },
                { name: "wire", wave: "0.1..0.",                                        },
            ],
        },
    },
    {   source: 'Tutorial1', discriminator: 'Step 4', desc: 'Spacers and Gaps',
        script: {
            signal: [
                { name: "clk",         wave: "p.....|...",                                        },
                { name: "Data",        wave: "x.345x|=.x", data: ["head", "body", "tail", "data"] },
                { name: "Request",     wave: "0.1..0|1.0",                                        },
                {},
                { name: "Acknowledge", wave: "1.....|01.",                                        },
            ]
        },
    },
    {   source: 'Tutorial1', discriminator: 'Step 5', desc: 'The Groups',
        script: {
            signal: [
                {        name: 'clk',   wave: 'p..Pp..P'               },
                [   'Master',
                    [   'ctrl',
                        {name: 'write', wave: '01.0....'               },
                        {name: 'read',  wave: '0...1..0'               },
                    ],
                    {    name: 'addr',  wave: 'x3.x4..x', data: 'A1 A2'},
                    {    name: 'wdata', wave: 'x3.x....', data: 'D1'   },
                ],
                {},
                [   'Slave',
                    [   'ctrl',
                        {name: 'ack',   wave: 'x01x0.1x'               },
                    ],
                    {    name: 'rdata', wave: 'x.....4x', data: 'Q2'   },
                ],
            ],
        },
    },
    {   source: 'Tutorial1', discriminator: 'Step 6', desc: 'Period and Phase',
        script: {
            signal: [
                { name: "CK",   wave: "P.......",                                              period: 2   },
                { name: "CMD",  wave: "x.3x=x4x=x=x=x=x", data: "RAS NOP CAS NOP NOP NOP NOP", phase:  0.5 },
                { name: "ADDR", wave: "x.=x..=x........", data: "ROW COL",                     phase:  0.5 },
                { name: "DQS",  wave: "z.......0.1010z.",                                                  },
                { name: "DQ",   wave: "z.........5555z.", data: "D0 D1 D2 D3",                             },
            ],
        },
    },
    {   source: 'Tutorial1', discriminator: 'Step 7a', desc: 'The `config{}` Property - hscale = 1',
        script: {
            signal: [
                { name: "clk",     wave: "p....",                                 },
                { name: "Data",    wave: "x345x",  data: ["head", "body", "tail"] },
                { name: "Request", wave: "01..0",                                 }
            ],
            config: { hscale: 1 },
        },
    },
    {   source: 'Tutorial1', discriminator: 'Step 7b', desc: 'The `config{}` Property - hscale = 2',
        script: {
            signal: [
                { name: "clk",     wave: "p....",                                 },
                { name: "Data",    wave: "x345x",  data: ["head", "body", "tail"] },
                { name: "Request", wave: "01..0",                                 }
            ],
            config: { hscale: 2 },
        },
    },
    {   source: 'Tutorial1', discriminator: 'Step 7c', desc: 'The `config{}` Property - hscale = 3',
        script: {
            signal: [
                { name: "clk",     wave: "p....",                                 },
                { name: "Data",    wave: "x345x",  data: ["head", "body", "tail"] },
                { name: "Request", wave: "01..0",                                 }
            ],
            config: { hscale: 3 },
        },
    },
    {   source: 'Tutorial1', discriminator: 'Step 7d', desc: 'The `config{}` Property - skin = default',
        script: {
            signal: [
                { name: "clk",     wave: "p....",                                 },
                { name: "Data",    wave: "x345x",  data: ["head", "body", "tail"] },
                { name: "Request", wave: "01..0",                                 }
            ],
            config: { skin: 'default' },
        },
    },
    {   source: 'Tutorial1', discriminator: 'Step 7e', desc: 'The `config{}` Property - skin = narrow',
        script: {
            signal: [
                { name: "clk",     wave: "p....",                                 },
                { name: "Data",    wave: "x345x",  data: ["head", "body", "tail"] },
                { name: "Request", wave: "01..0",                                 }
            ],
            config: { skin: 'narrow' },
        },
    },
    {   source: 'Tutorial1', discriminator: 'Step 7f', desc: 'The `config{}` Property - head/foot',
        script: {
            signal: [
                { name: 'clk',         wave: 'p....',               },
                { name: 'Data',        wave: 'x345x', data: 'a b c' },
                { name: 'Request',     wave: '01..0',               },
            ],
            head: {
                text:  'WaveDrom example',
                tick:  0,
                every: 2,
            },
            foot:{
                text:  'Figure 100',
                tock:  9,
            },
        },
    },
    {   source: 'Tutorial1', discriminator: 'Step 7g', desc: 'The `config{}` Property - head/foot (SVG text)',
        script: {
            signal: [
                { name: 'clk', wave: 'p.....PPPPp....' },
                { name: 'dat', wave: 'x....2345x.....', data: 'a b c d' },
                { name: 'req', wave: '0....1...0.....' }
            ],
            head: {
                text: [
                    'tspan',
                    [ 'tspan', { class:'error h1'                                         }, 'error '           ],
                    [ 'tspan', { class:'warning h2'                                       }, 'warning '         ],
                    [ 'tspan', { class:'info h3'                                          }, 'info '            ],
                    [ 'tspan', { class:'success h4'                                       }, 'success '         ],
                    [ 'tspan', { class:'muted h5'                                         }, 'muted '           ],
                    [ 'tspan', { class:'h6'                                               }, 'h6 '              ],
                    'default ',
                    [ 'tspan', { fill:'pink', 'font-weight':'bold', 'font-style':'italic' }, 'pink-bold-italic' ],
                ],
            },
            foot: {
                text: [
                    'tspan',
                    'E=mc',
                    ['tspan', { dy: '-5'                       }, '2'      ],
                    ['tspan', { dy:  '5'                       }, '. '     ],
                    ['tspan', { 'font-size'      : '25'        }, 'B '     ],
                    ['tspan', { 'text-decoration': 'overline'  }, 'over '  ],
                    ['tspan', { 'text-decoration': 'underline' }, 'under ' ],
                    ['tspan', { 'baseline-shift' : 'sub'       }, 'sub '   ],
                    ['tspan', { 'baseline-shift' : 'super'     }, 'super ' ],
                ],
                tock: -5,
            },
        },
    },
    {   source: 'Tutorial1', discriminator: 'Step 8a', desc: 'Spline Arrows',
        script: {
            signal: [
                { name: 'A', wave: '01........0....',  node: '.a........j' },
                { name: 'B', wave: '0.1.......0.1..',  node: '..b.......i' },
                { name: 'C', wave: '0..1....0...1..',  node: '...c....h..' },
                { name: 'D', wave: '0...1..0.....1.',  node: '....d..g...' },
                { name: 'E', wave: '0....10.......1',  node: '.....ef....' },
            ],
            edge: [
                'a~b t1',
                'c-~a t2',
                'c-~>d time 3',
                'd~-e',
                'e~>f',
                'f->g',
                'g-~>h',
                'h~>i some text',
                'h~->j',
            ],
        },
    },
    {   source: 'Tutorial1', discriminator: 'Step 8b', desc: 'Sharp Line Arrows',
        script: {
            signal: [
                { name: 'A', wave: '01..0..',  node: '.a..e..',           },
                { name: 'B', wave: '0.1..0.',  node: '..b..d.', phase:0.5 },
                { name: 'C', wave: '0..1..0',  node: '...c..f',           },
                {                              node: '...g..h',           },
                {                              node: '...I..J', phase:0.5 },
                { name: 'D', wave: '0..1..0',                   phase:0.5 },
            ],
            edge: [
                'b-|a t1',
                'a-|c t2',
                'b-|-c t3',
                'c-|->e t4',
                'e-|>f more text',
                'e|->d t6',
                'c-g',
                'f-h',
                'g<->h 3 ms',
                'I+J 5 ms',
            ],
        },
    },
    {   source: 'Tutorial1', discriminator: 'Step 9', desc: 'Some Code',
        script: { signal: GenerateGreyCode(5, 16) },
    },
];
const tutorial2_wavedrom_scripts : readonly ScriptTestCase[] = [
    {   source: 'Tutorial2', discriminator: 'XOR Gate', desc: 'XOR gate constructed using AND and NOT gates',
        script: {
            assign: [
                [   "out",
                    [   "|",
                        [ "&", ["~", "a"], "b" ],
                        [ "&", ["~", "b"], "a" ],
                    ],
                ],
            ],
        },
    },
    {   source: 'Tutorial2', discriminator: 'XOR Gate (IEC 60617)', desc: 'XOR gate constructed using AND and NOT gates (IEC 60617 symbols)',
        script: {
            assign: [
                [   "out",
                    [   "OR",
                       [ "AND", ["INV", "a"], "b"],
                       [ "AND", ["INV", "b"], "a"],
                    ],
                ],
            ],
        },
    },
    {   source: 'Tutorial2', discriminator: 'Binary to Gray', desc: 'From binary to gray code (four bit)',
        script: {
            assign: [
                [ "g0", ["^", "b0", "b1" ] ],
                [ "g1", ["^", "b1", "b2" ] ],
                [ "g2", ["^", "b2", "b3" ] ],
                [ "g3", ["=", "b3"       ] ],
            ],
        },
    },
    {   source: 'Tutorial2', discriminator: 'Gray to Binary', desc: 'From gray code to binary (four bit)',
        script: {
            assign: [
                [ "b3", "g3"              ],
                [ "b2", ["^", "b3", "g2"] ],
                [ "b1", ["^", "b2", "g1"] ],
                [ "b0", ["^", "b1", "g0"] ],
            ],
        },
    },
    {   source: 'Tutorial2', discriminator: '74LS688', desc: 'Eight-bit Equality Comparator',
        // reference page 4 of the datasheet:
        // https://web.archive.org/web/20220624202556/https://www.ti.com/lit/ds/symlink/sn74ls688.pdf?ts=1656102232959&ref_url=https%253A%252F%252Fwww.ti.com%252Fproduct%252FSN74LS688
        script: {
            assign: [
                [   "z",
                    [   "~&",
                        [   "~^",
                            [   "~", "p0" ],
                            [   "~", "q0" ],
                        ],
                        [   "~^",
                            [   "~", "p1" ],
                            [   "~", "q1" ],
                        ],
                        [   "~^",
                            [   "~", "p2" ],
                            [   "~", "q2" ],
                        ],
                        "...",
                        [   "~^",
                            [   "~", "p7" ],
                            [   "~", "q7" ],
                        ],
                        [   "~","~en" ],
                    ],
                ],
            ],
        },
    },
    {   source: 'Tutorial2', discriminator: 'IEC 60617 Symbols', desc: 'Use alternate symbols (IEC 60617)',
        script: {
            assign: [
                [   "out",
                    [   "XNOR",
                        [   "NAND",
                            [   "INV", "a"],
                            [   "NOR",
                                "b", [   "BUF",  "c" ],
                            ],
                        ],
                        [   "AND",
                            [   "XOR",
                                "d",
                                "e",
                                [   "OR",
                                    "f",
                                    "g"
                                ],
                            ],
                            "h",
                        ],
                    ],
                ],
            ],
        },
    },
];
const test_html_wavedrom_scripts : readonly ScriptTestCase[] = [
    {   source: 'test.html', discriminator: 'Test 1', desc: 'Single Lane',
        script: { signal: [{ name: "Alfa", wave: "01.zx=ud.23.45" }] },
    },
    {   source: 'test.html', discriminator: 'Test 2', desc: 'Clocks',
        script: {
            signal: [
                { name: "pclk", wave: 'p.......' },
                { name: "Pclk", wave: 'P.......' },
                { name: "nclk", wave: 'n.......' },
                { name: "Nclk", wave: 'N.......' },
                {},
                { name: 'clk0', wave: 'phnlPHNL' },
                { name: 'clk1', wave: 'xhlhLHl.' },
                { name: 'clk2', wave: 'hpHplnLn' },
                { name: 'clk3', wave: 'nhNhplPl' },
                { name: 'clk4', wave: 'xlh.L.Hx' },
            ],
        },
    },
    {   source: 'test.html', discriminator: 'Test 3', desc: 'Named Sections ("=")',
        script: {
            signal: [
                { name: "clk",  wave: "P......" },
                { name: "bus",  wave: "x.==.=x", data: ["head", "body", "tail", "data"] },
                { name: "wire", wave: "0.1..0." },
            ],
        },
    },
    {   source: 'test.html', discriminator: 'Test 4', desc: 'Named & Color-Coded Sections ("=" and numeric)',
        script: {
            signal: [
                { name: "clk",         wave: "p.....|..." },
                { name: "Data",        wave: "x.345x|=.x", data: ["head", "body", "tail", "data"] },
                { name: "Request",     wave: "0.1..0|1.0" },
                {},
                { name: "Acknowledge", wave: "1.....|01." },
            ],
        },
    },
    {   source: 'test.html', discriminator: 'Test 5', desc: 'Named Lane Groupings',
        script: {
            signal: [
                {    name: 'clk',   wave: 'p..Pp..P'},
                [   'Master',
                    [   'ctrl',
                        {name: 'write', wave: '01.0....'},
                        {name: 'read',  wave: '0...1..0'},
                    ],
                    {  name: 'addr',  wave: 'x3.x4..x', data: 'A1 A2'},
                    {  name: 'wdata', wave: 'x3.x....', data: 'D1'   },
                ],
                {},
                [   'Slave',
                    [   'ctrl',
                        {name: 'ack',   wave: 'x01x0.1x'},
                    ],
                    {  name: 'rdata', wave: 'x.....4x', data: 'Q2'},
                ],
            ],
        },
    },
    {   source: 'test.html', discriminator: 'Test 6', desc: 'Clock Period and Phase Shifts',
        script: {
            signal: [
                { name: "CK",   wave: "P.......",                                              period: 2  },
                { name: "CMD",  wave: "x.3x=x4x=x=x=x=x", data: "RAS NOP CAS NOP NOP NOP NOP", phase: 0.5 },
                { name: "ADDR", wave: "x.=x..=x........", data: "ROW COL",                     phase: 0.5 },
                { name: "DQS",  wave: "z.......0.1010z."                                                  },
                { name: "DQ",   wave: "z.........5555z.", data: "D0 D1 D2 D3"                             },
            ],
        },
    },
    {   source: 'test.html', discriminator: 'Test 7', desc: 'HScale:1 (baseline)',
        script: {
            signal: [
                { name: "clk",     wave: "p...." },
                { name: "Data",    wave: "x345x",  data: ["head", "body", "tail"] },
                { name: "Request", wave: "01..0" },
            ],
            config: { hscale: 1 },
        },
    },
    {   source: 'test.html', discriminator: 'Test 8', desc: 'HScale:2 (2x stretch)',
        script: {
            "signal" : [
                { "name": "clk",         "wave": "p...." },
                { "name": "Data",        "wave": "x345x", "data": ["head", "body", "tail"] },
                { "name": "Request",     "wave": "01..0" },
            ],
            "config" : { "hscale" : 2 },
        },
    },
    {   source: 'test.html', discriminator: 'Test 9', desc: 'HScale:3 (3x stretch)',
        script: {
            "signal" : [
                { "name": "clk",         "wave": "p...." },
                { "name": "Data",        "wave": "x345x", "data": ["head", "body", "tail"] },
                { "name": "Request",     "wave": "01..0" },
            ],
            "config" : { "hscale" : 3 },
        },
    },
    {   source: 'test.html', discriminator: 'Test 10', desc: 'Header',
        script: {
            signal: [
                {name:'clk',         wave: 'p....' },
                {name:'Data',        wave: 'x345x', data: 'a b c' },
                {name:'Request',     wave: '01..0' },
            ],
            head:{
                text:'WaveDrom example',
                tick:0,
            },
            foot:{
                text:'Figure 100',
                tock:9,
            },
        },
    },
    {   source: 'test.html', discriminator: 'Test 11', desc: 'Custom Header with CSS Classes',
        script: {
            signal: [
                {name:'clk', wave: 'p.....PPPPp....' },
                {name:'dat', wave: 'x....2345x.....', data: 'a b c d' },
                {name:'req', wave: '0....1...0.....' },
            ],
            head: {
                text: [
                    'tspan',                                      
                    ['tspan', {class:'error h1'                                        }, 'error   '        ],
                    ['tspan', {class:'warning h2'                                      }, 'warning '        ],
                    ['tspan', {class:'info h3'                                         }, 'info    '        ],
                    ['tspan', {class:'success h4'                                      }, 'success '        ],
                    ['tspan', {class:'muted h5'                                        }, 'muted   '        ],
                    ['tspan', {class:'h6'                                              }, 'h6      '        ],
                    'default ',
                    ['tspan', {fill:'pink', 'font-weight':'bold', 'font-style':'italic'}, 'pink-bold-italic'],
                ],
            },
            foot: {
                text: [
                    'tspan',
                    'E=mc',
                    ['tspan', { dy:'-5'                      }, '2'      ],
                    ['tspan', { dy: '5'                      }, '. '     ],
                    ['tspan', {'font-size':'25'              }, 'B '     ],
                    ['tspan', {'text-decoration':'overline'  }, 'over '  ],
                    ['tspan', {'text-decoration':'underline' }, 'under ' ],
                    ['tspan', {'baseline-shift':'sub'        }, 'sub '   ],
                    ['tspan', {'baseline-shift':'super'      }, 'super ' ],
                ],
                tock: -5,
            }
        },
    },
    {   source: 'test.html', discriminator: 'Test 12', desc: 'Spline Arrows',
        script: {
            signal: [
                { name: 'A', wave: '01........0....',  node: '.a........j' },
                { name: 'B', wave: '0.1.......0.1..',  node: '..b.......i' },
                { name: 'C', wave: '0..1....0...1..',  node: '...c....h..' },
                { name: 'D', wave: '0...1..0.....1.',  node: '....d..g...' },
                { name: 'E', wave: '0....10.......1',  node: '.....ef....' },
            ],
            edge: [
                // note: cannot add extra spaces between connector and text
                'a~b t1',
                'c-~a t2',
                'c-~>d time 3',
                'd~-e',
                'e~>f',
                'f->g',
                'g-~>h',
                'h~>i some text',
                'h~->j',
            ],
        },
    },
    {   source: 'test.html', discriminator: 'Test 13', desc: 'Sharp Line Arrows',
        script: {   // index && test.html test 13
            signal: [
                { name: 'A', wave: '01..0..',  node: '.a..e..',           },
                { name: 'B', wave: '0.1..0.',  node: '..b..d.', phase:0.5 },
                { name: 'C', wave: '0..1..0',  node: '...c..f',           },
                {                              node: '...g..h',           },
                {                              node: '...I..J', phase:0.5 },
                { name: 'D', wave: '0..1..0',                   phase:0.5 },
            ],
            edge: [
                // note: cannot add extra spaces between connector and text
                'b-|a t1',
                'a-|c t2',
                'b-|-c t3',
                'c-|->e t4',
                'e-|>f more text',
                'e|->d t6',
                'c-g',
                'f-h',
                'g<->h 3 ms',
                'I+J 5 ms',
            ],
        },
    },
    {   source: 'test.html', discriminator: 'Test 14', desc: 'Function-Generated Gray Code',
        script: { signal: GenerateGreyCode(5, 16) },
    },
    {   source: 'test.html', discriminator: 'Test 15', desc: 'No GMarks (??? no visible difference ???)',
        script: {
            signal: [
                { name: "clk",         wave: "p.....|...",                                        },
                { name: "Data",        wave: "x.345x|=.x", data: ["head", "body", "tail", "data"] },
                { name: "Request",     wave: "0.1..0|1.0",                                        },
                {},
                { name: "Acknowledge", wave: "1.....|01.",                                        },
            ],
            config: {marks: false},
        },
    },
    {   source: 'test.html', discriminator: 'Test 16', desc: 'Over/Under A Baseline',
        script: {
            signal: [
                {name: 'clk',   wave: 'p.PpPpPP',          },
                {name: 'dat →', wave: 'x.3.....', data: 'D'},
                {name: 'req →', wave: '0...1..0',          },
                {name: 'ack ←', wave: '0.....1.',          },
                {name: 'FF',    wave: 'x......3', data: 'D'},
            ],
            head:{tick: 1},
        },
    },
    {   source: 'test.html', discriminator: 'Test 17', desc: 'Over/Under A Comparison',
        script: {
            signal: [
                {name: 'clk',   wave: 'p.PpPpPP',                                               },
                {name: 'dat →', wave: 'x.3.....', data: 'D', over: '0...1..0', under: '0.....1.'},
                {name: 'FF',    wave: 'x......3', data: 'D',                                    },
            ],
            head:{tick: 1},
        },
    },
    {   source: 'test.html', discriminator: 'Test 18', desc: 'Over/Under B Baseline',
        script: {
            signal: [
                {name: 'clk',   wave: 'p.PpPpPP',          },
                {name: 'dat →', wave: 'x...3...', data: 'D'},
                {name: 'req →', wave: '0.....10',          },
                {name: 'ack ←', wave: '0.1.....',          },
                {name: 'FF',    wave: 'x......3', data: 'D'},
            ],
            head:{tick: 1},
        },
    },
    {   source: 'test.html', discriminator: 'Test 19', desc: 'Over/Under B Comparison',
        script: {
            signal: [
                {name: 'clk',   wave: 'p.PpPpPP',                                               },
                {name: 'dat →', wave: 'x...3...', data: 'D', over: '0.....10', under: '0.1.....'},
                {name: 'FF',    wave: 'x......3', data: 'D',                                    },
            ],
            head:{tick: 1},
        },
    },
    {   source: 'test.html', discriminator: 'Test 20', desc: 'Over/Under C Baseline',
        script: {
            signal: [
                {name: 'clk',   wave: 'p.PpPPPPp.P.',                 },
                {name: 'dat →', wave: 'x.3..4.5...6', data: 'D1 D2 D3'},
                {name: 'req →', wave: '0.1..1.1...1',                 },
                {name: 'ack ←', wave: '0...1010..10',                 },
                {name: 'FF',    wave: 'x....3.4...5', data: 'D1 D2 D3'},
            ],
            head:{tick: 1}
        },
    },
    {   source: 'test.html', discriminator: 'Test 21', desc: 'Over/Under C Comparison (with period & phase offsets)',
        script: {
            signal: [
                {name: 'clk',   wave: 'p.PpPPPPp.P.'},

                {name: 'dat →', wave: 'x.3..4.5...6', data: 'D1 D2 D3', over: '0.1..1.1...1', under: '0...1010..10',                        },
                {name: 'dat →', wave: 'x.3..4.5...6', data: 'D1 D2 D3', over: '0.1..1.1...1', under: '0...1010..10', phase:  .5,            },
                {name: 'dat →', wave: 'x.3..4.5...6', data: 'D1 D2 D3', over: '0.1..1.1...1', under: '0...1010..10', phase: 1  ,            },
                {name: 'dat →', wave: 'x.3..4.5...6', data: 'D1 D2 D3', over: '0.1..1.1...1', under: '0...1010..10', phase: 1.7,            },

                {name: 'dat →', wave: 'x.3..4.5...6', data: 'D1 D2 D3', over: '0.1..1.1...1', under: '0...1010..10', period: 2,             },
                {name: 'dat →', wave: 'x.3..4.5...6', data: 'D1 D2 D3', over: '0.1..1.1...1', under: '0...1010..10', period: 2, phase:  .5  },
                {name: 'dat →', wave: 'x.3..4.5...6', data: 'D1 D2 D3', over: '0.1..1.1...1', under: '0...1010..10', period: 2, phase: 1    },
                {name: 'dat →', wave: 'x.3..4.5...6', data: 'D1 D2 D3', over: '0.1..1.1...1', under: '0...1010..10', period: 2, phase: 1.7  },

                {name: 'dat →', wave: 'x.3..4.5...6', data: 'D1 D2 D3', over: '0.1..2.3...4', under: '0...1010..10', period: 0.5,           },
                {name: 'dat →', wave: 'x.3..4.5...6', data: 'D1 D2 D3', over: '0.1..5.6...7', under: '0...1010..10', period: 0.5, phase:  .5},
                {name: 'dat →', wave: 'x.3..4.5...6', data: 'D1 D2 D3', over: '0.1..8.1...1', under: '0...1010..10', period: 0.5, phase: 1  },
                {name: 'dat →', wave: 'x.3..4.5...6', data: 'D1 D2 D3', over: '0.1..1.1...1', under: '0...1010..10', period: 0.5, phase: 1.7}, // BUGBUG -- OVER for D1 appears off the left edge of lane

                {name: 'FF',    wave: 'x....3.4...5', data: 'D1 D2 D3'},
            ],
            head:{tick: 1},
        },
    },
    {   source: 'test.html', discriminator: 'Test 22', desc: 'Clock Edge Arrows, label every 5th clock tick',
        script: {
            signal: [
                {name: 'clk',   wave: 'p.PpPPPPp.P.',                 },
                {name: 'dat →', wave: 'x.3..4.5...6', data: 'D1 D2 D3'},
            ],
            head:{tick: -1, every: 5},
        },
    },
    {   source: 'test.html', discriminator: 'Test 23', desc: 'Custom Waveform Signals (embedded SVG lines)',
        script: {
            signal: [
                {name: 'clock',    wave: 'p.......'                                                          },
                {name: 'sawtooth', wave: ['pw', {d: ['m',1,0, 'l',2,1, 'v',-1, 'l',2,1, 'v',-1]}           ] },
                {name: 'triangle', wave: ['pw', {d: 'm,0,0  l,2,1  l,2,-1  l,2,1  l,2,-1'}                 ] },
                {name: 'RC',       wave: ['pw', {d: 'm,0,0 q,.5,1,1,1 h,1 q,.5,-1,1,-1 h,1 q,.5,1,1,1 h,1'}] },
            ],
        },
    },
    {   source: 'test.html', discriminator: 'Test 24', desc: 'Custom Waveform Signals [[ HSCALE FAILURE ]]',
        // To fix this, should apply an SVG transform on the lane...
        script: {
            signal: [
                {name: 'clock',    wave: 'p.......'                                                          },
                {name: 'sawtooth', wave: ['pw', {d: ['m',1,0, 'l',2,1, 'v',-1, 'l',2,1, 'v',-1]}           ] },
                {name: 'triangle', wave: ['pw', {d: 'm,0,0  l,2,1  l,2,-1  l,2,1  l,2,-1'}                 ] },
                {name: 'RC',       wave: ['pw', {d: 'm,0,0 q,.5,1,1,1 h,1 q,.5,-1,1,-1 h,1 q,.5,1,1,1 h,1'}] },
            ],
            config: { hscale: 2 },
        },
    },
];
const other_wavedrom_scripts : readonly ScriptTestCase[] = [
    {   source: 'other', discriminator: 'Empty Signal',      desc: 'Just an empty signal array',
        script: { signal: [] },
    },
    {   source: 'other', discriminator: 'Empty Assign',      desc: 'Just an empty assign array',
        script: { assign: [] },
    },
    {   source: 'other', discriminator: 'Empty Reg',      desc: 'Just an empty reg array',
        script: { reg: [] },
    },
];
export const all_test_wavedrom_scripts : readonly ScriptTestCase[] = [
    ...tutorial1_wavedrom_scripts,
    ...tutorial2_wavedrom_scripts,
    ...test_html_wavedrom_scripts,
    ...other_wavedrom_scripts,
];
