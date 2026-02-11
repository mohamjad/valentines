export const LEVELS = [
    { // level 0 – tutorial + one heart to advance to level 1
        plats: [
            { x: 400, y: 520, key: 'platform0' },
            { x: 620, y: 520, key: 'platform0' },
        ],
        coinPositions: [[512, 460]],
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
    }, { // level 3 – MINE SHAFT Section 1 only: ends at first checkpoint
        doubleJump: true,
        gravity: 560,
        worldWidth: 1400,
        worldMinY: -100,
        groundDeathY: 550,
        spawn: { x: 100, y: 368 },
        checkpoints: [
            { x: 1205, y: 290 },   // on P5 – level ends here
        ],
        coinPositions: [
            [1205, 230],   // heart above P5 at checkpoint – collect to complete level
        ],
        plats: [
            {x: 0, y: 400, key: 'platform5'},       // P1 Start
            {x: 300, y: 400, key: 'platform0'},     // P2; bouncer at 360
            {x: 600, y: 290, key: 'platform0'},     // P3; 110px UP; spikes below
            {x: 900, y: 290, key: 'platform0'},     // P4; bouncer at 950
            {x: 1150, y: 290, key: 'platform0'},    // P5; checkpoint + goal
        ],
        spikes: [
            { x: 450, y: 520, width: 300, height: 20 },
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
    }, { // level 5 – Will you be my Valentine? Simple jump to the heart at the end
        valentineChoiceLevel: true,
        doubleJump: true,
        gravity: 560,
        worldWidth: 1200,
        groundDeathY: 500,
        spawn: { x: 100, y: 368 },
        yesZone: { x: 950, y: 320, width: 120, height: 100 },
        coinPositions: [[1010, 300]],   // heart at the end – collect to say yes
        plats: [
            {x: 0, y: 400, key: 'platform5'},       // start
            {x: 280, y: 400, key: 'platform0'},
            {x: 520, y: 350, key: 'platform0'},
            {x: 760, y: 400, key: 'platform0'},
            {x: 980, y: 350, key: 'platform0'},    // under the heart
        ],
        staticMobs: [],
        dynamicMobs: [],
        art: [],
        deco: []
    }
];
