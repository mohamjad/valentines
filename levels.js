export const LEVELS = [
    { // level 0 – tutorial + floor hearts to advance to level 2
        plats: [
            { x: 400, y: 520, key: 'platform0' },
            { x: 620, y: 520, key: 'platform0' },
        ],
        coinPositions: [
            [320, 700],   // floor hearts (on base ground)
            [512, 700],
            [704, 700],
        ],
    }, { // level 1 (first level)
        plats: [
            {x: 435, y: 330, key: 'platform0'},
            {x: 744, y: 440, key: 'platform3'},
            {x: 0, y: 460, key: 'platform2'},
            {x: 460, y: 580, key: 'platform1'},
        ],
        art: [
            {x: 50, y: 727, key: 'tree1'},
            {x: 650, y: 727, key: 'shrub0'},
            {x: 875, y: 727, key: 'tree0'},
            {x: 480, y: 580, key: 'flower0'},
            {x: 50, y: 180, key: 'cloud0'},
            {x: 230, y: 230, key: 'cloud1'},
            {x: 840, y: 200, key: 'cloud0'}
        ],
        deco: [
            {x: 24, y: 48}, {x: 880, y: 120}, {x: 512, y: 280}, {x: 80, y: 520}, {x: 920, y: 640}
        ],
        coinPositions: [
            [435, 270],   // above platform0
            [744, 380],   // above platform3
            [460, 520],   // above platform1
        ],
    }, { // level 2 – COMBINED TEST: physics (P1–P5) + coin recharge (P6–P9)
        doubleJump: true,
        gravity: 560,
        worldWidth: 3900,
        worldMinY: -400,
        groundDeathY: 500,
        spawn: { x: 100, y: 351 },
        coinPositions: [
            [2580, -40],   // Coin 1: 410px from P6 edge (2170) – MUST double jump to reach; then recharge for P7
            [3450, -170],  // Coin 2: first rung (130px above P8)
            [3450, -300],  // Coin 3: second rung (130px above Coin 2)
            [3775, -320],  // Final heart on P9 – collect to complete level
        ],
        plats: [
            // --- Physics verification (P1–P5) ---
            {x: 0, y: 400, key: 'platform5'},     // P1 Start (width 200, height 40)
            {x: 350, y: 400, key: 'platform0'},   // P2 Single Jump Test; gap 150px
            {x: 600, y: 260, key: 'platform0'},    // P3 Vertical Single Jump; 100px H, 140px UP
            {x: 850, y: 90, key: 'platform0'},    // P4 Double Jump Required; 130px H, 170px UP
            {x: 1720, y: 90, key: 'platform0'},   // P5 Max Double Jump Distance; ~720px from P4
            // --- Coin recharge tests (P6–P9) ---
            {x: 2050, y: 90, key: 'platform0'},   // P6; edge at 2170; gap 130px from P5
            {x: 2900, y: -40, key: 'platform0'},  // P7 Extended; ~320px from Coin 1 – need recharge then 1 jump
            {x: 3200, y: -40, key: 'platform0'},   // P8; gap 150px (easy)
            {x: 3700, y: -300, key: 'platform0'},  // P9 Sky Platform; triple jump via Coin 2 → Coin 3 → P9
        ],
        art: [],
        deco: []
    }, { // level 3 – MINE SHAFT: ends at 2nd checkpoint (heart on P8)
        doubleJump: true,
        gravity: 560,
        worldWidth: 2600,
        worldMinY: -100,
        groundDeathY: 550,
        spawn: { x: 100, y: 368 },
        checkpoints: [
            { x: 1205, y: 290 },   // on P5 after Section 1
            { x: 2460, y: 290 },   // on P8 – level goal (heart here)
        ],
        coinPositions: [
            [2460, 230],   // heart at 2nd checkpoint – collect to complete level
        ],
        plats: [
            {x: 0, y: 400, key: 'platform5'},       // P1 Start
            {x: 300, y: 400, key: 'platform0'},     // P2; bouncer at 360
            {x: 600, y: 290, key: 'platform0'},     // P3; 110px UP; spikes below
            {x: 900, y: 290, key: 'platform0'},     // P4; bouncer at 950
            {x: 1150, y: 290, key: 'platform0'},    // P5; after checkpoint 1
            {x: 1900, y: 190, key: 'platform0'},    // P6; after Coin 1; long spike pit below
            {x: 2150, y: 290, key: 'platform0'},    // P7; 100px down breather
            {x: 2400, y: 290, key: 'platform0'},    // P8; after checkpoint 2 (goal)
        ],
        spikes: [
            { x: 450, y: 520, width: 300, height: 20 },
            { x: 1300, y: 420, width: 700, height: 20 },
        ],
        staticMobs: [],
        dynamicMobs: [
            [360, 350, 'bomb'],    // Bounce around P2
            [950, 250, 'bomb'],    // Bounce around P4
        ],
        art: [],
        deco: []
    }, { // level 4 – VALENTINE'S HEART: one heart-shaped coin chain, no enemies
        doubleJump: true,
        gravity: 560,
        worldWidth: 2600,
        worldMinY: -100,
        groundDeathY: 550,
        spawn: { x: 100, y: 368 },
        checkpoints: [
            { x: 640, y: 400 },   // on P3 (Launch Platform)
        ],
        coinPositions: [
            [980, 300],   // C1 left going UP
            [1180, 150],  // C2 left peak
            [1430, 250],  // C3 center dip
            [1680, 150],  // C4 right going UP
            [2290, 260],  // C5 last heart on goal platform (Landing in Love)
        ],
        plats: [
            {x: 0, y: 400, key: 'platform5'},       // P1 Start
            {x: 300, y: 400, key: 'platform0'},      // P2; gap 100px
            {x: 550, y: 400, key: 'platform0'},      // P3 Launch Platform; gap 50px
            {x: 2200, y: 300, key: 'platform0'},     // P4 GOAL (Landing in Love)
            {x: 2380, y: 300, key: 'platform0'},     // P4 continued – wide celebration zone
        ],
        spikes: [
            { x: 700, y: 530, width: 1600, height: 20 },
        ],
        staticMobs: [],
        dynamicMobs: [],
        art: [],
        deco: []
    }, { // level 5 – Will you be my Valentine?
        valentineChoiceLevel: true,
        doubleJump: true,
        gravity: 560,
        worldWidth: 1200,
        groundDeathY: 500,
        spawn: { x: 100, y: 368 },
        yesZone: { x: 950, y: 320, width: 120, height: 100 },
        coinPositions: [[1010, 300]],
        plats: [
            {x: 0, y: 400, key: 'platform5'},
            {x: 280, y: 400, key: 'platform0'},
            {x: 520, y: 350, key: 'platform0'},
            {x: 760, y: 400, key: 'platform0'},
            {x: 980, y: 350, key: 'platform0'},
        ],
        staticMobs: [],
        dynamicMobs: [],
        art: [],
        deco: []
    }, { // level 6 – FAREWELL (Celeste veterans only)
        doubleJump: true,
        gravity: 560,
        worldWidth: 7800,
        worldMinY: -650,
        groundDeathY: 100,
        spawn: { x: 60, y: 368 },
        checkpoints: [
            { x: 3390, y: -140 },   // on P8 (was 3300 – spawned in void)
            { x: 6090, y: -340 },   // on P13 (was 6000 – spawned in void)
        ],
        coinPositions: [
            [1010, -40],    [2620, -40],    [2820, -140],   [3780, -240],
            [3980, -340],   [4180, -440],   [4380, -540],   [5450, -240],
            [6480, -440],   [6730, -540],   [6980, -440],   [7230, -540],
        ],
        plats: [
            { x: 0, y: 400, key: 'platform5' },        { x: 370, y: 260, key: 'platform0' },
            { x: 600, y: 90, key: 'platform0' },       { x: 1710, y: -40, key: 'platform0' },
            { x: 1940, y: -40, key: 'platform0' },     { x: 2190, y: 60, key: 'platform0' },
            { x: 3100, y: -140, key: 'platform0' },     { x: 3350, y: -140, key: 'platform0' },
            { x: 4700, y: -540, key: 'platform0' },     { x: 4950, y: -540, key: 'platform0' },
            { x: 5200, y: -440, key: 'platform0' },     { x: 5800, y: -340, key: 'platform0' },
            { x: 6050, y: -340, key: 'platform0' },     { x: 7350, y: -540, key: 'platform5' },
            { x: 7550, y: -540, key: 'platform5' },
        ],
        spikes: [
            { x: 500, y: 20, width: 200, height: 20 },   { x: 700, y: 200, width: 1100, height: 20 },
            { x: 2090, y: -40, width: 20, height: 100 }, { x: 2270, y: -40, width: 20, height: 100 },
            { x: 2500, y: -140, width: 20, height: 200 }, { x: 3200, y: -140, width: 20, height: 200 },
            { x: 3700, y: -620, width: 1100, height: 20 }, { x: 3500, y: -50, width: 1300, height: 20 },
            { x: 5300, y: -540, width: 20, height: 300 }, { x: 5880, y: -540, width: 20, height: 300 },
            { x: 6200, y: -50, width: 1500, height: 20 },  { x: 6400, y: -620, width: 1000, height: 20 },
        ],
        staticMobs: [],
        dynamicMobs: [
            [415, 220, 'bomb'], [1755, -80, 'bomb'], [2750, -80, 'bomb'], [4080, -380, 'bomb'],
            [5550, -180, 'bomb'], [6605, -380, 'bomb'], [7105, -380, 'bomb'],
        ],
        art: [],
        deco: []
    }
];
