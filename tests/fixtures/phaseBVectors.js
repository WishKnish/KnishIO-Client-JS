// Frozen copies of the Phase B cross-SDK vectors in the monorepo master
// (../shared-test-results/canonical-patent-vectors.json), so the unit suites run in a
// standalone checkout. tests/patent-vectors.test.js asserts they equal the master.

// vectors.token_replenish.tests
export const TOKEN_REPLENISH_TESTS = [
  {
    name: 'fungible_replenish',
    token: 'REPLTOK',
    amount: 500,
    units: [],
    expectedIsotopes: [
      'C',
      'I'
    ],
    expectedCValue: '500',
    expectedMetaType: 'token',
    expectedMetaId: 'REPLTOK',
    expectedAction: 'add',
    expectedTokenUnitIds: null
  },
  {
    name: 'stackable_replenish',
    token: 'REPLSTK',
    amount: null,
    units: [
      [
        'R1',
        'R1',
        {}
      ],
      [
        'R2',
        'R2',
        {}
      ]
    ],
    expectedIsotopes: [
      'C',
      'I'
    ],
    expectedCValue: '2',
    expectedMetaType: 'token',
    expectedMetaId: 'REPLSTK',
    expectedAction: 'add',
    expectedTokenUnitIds: [
      'R1',
      'R2'
    ]
  }
]

// vectors.stackable_fusion_conservation.tests
export const STACKABLE_FUSION_TESTS = [
  {
    name: 'fuse_2_of_2',
    sourceUnits: [
      'U1',
      'U2'
    ],
    fuse: [
      'U1',
      'U2'
    ],
    newUnitId: 'FUSED',
    expectedIsotopes: [
      'V',
      'V',
      'F',
      'V'
    ],
    expectedSourceValue: '-2',
    expectedSourceUnitIds: [
      'U1',
      'U2'
    ],
    expectedBurnValue: '1',
    expectedFusionValue: '1',
    expectedRemainderValue: '0',
    expectedBurnUnitIds: [
      'U1'
    ],
    expectedRemainderUnitIds: [],
    expectedFusedTokenUnitIds: [
      'U1',
      'U2'
    ],
    expectedSum: '0'
  },
  {
    name: 'fuse_2_of_5',
    sourceUnits: [
      'U1',
      'U2',
      'U3',
      'U4',
      'U5'
    ],
    fuse: [
      'U2',
      'U4'
    ],
    newUnitId: 'FUSED',
    expectedIsotopes: [
      'V',
      'V',
      'F',
      'V'
    ],
    expectedSourceValue: '-5',
    expectedSourceUnitIds: [
      'U2',
      'U4'
    ],
    expectedBurnValue: '1',
    expectedFusionValue: '1',
    expectedRemainderValue: '3',
    expectedBurnUnitIds: [
      'U2'
    ],
    expectedRemainderUnitIds: [
      'U1',
      'U3',
      'U5'
    ],
    expectedFusedTokenUnitIds: [
      'U2',
      'U4'
    ],
    expectedSum: '0'
  },
  {
    name: 'fuse_3_of_5',
    sourceUnits: [
      'U1',
      'U2',
      'U3',
      'U4',
      'U5'
    ],
    fuse: [
      'U2',
      'U4',
      'U5'
    ],
    newUnitId: 'FUSED',
    expectedIsotopes: [
      'V',
      'V',
      'F',
      'V'
    ],
    expectedSourceValue: '-5',
    expectedSourceUnitIds: [
      'U2',
      'U4',
      'U5'
    ],
    expectedBurnValue: '2',
    expectedFusionValue: '1',
    expectedRemainderValue: '2',
    expectedBurnUnitIds: [
      'U2',
      'U4'
    ],
    expectedRemainderUnitIds: [
      'U1',
      'U3'
    ],
    expectedFusedTokenUnitIds: [
      'U2',
      'U4',
      'U5'
    ],
    expectedSum: '0'
  },
  {
    name: 'fuse_single_unit_rejected',
    sourceUnits: [
      'U1',
      'U2',
      'U3',
      'U4',
      'U5'
    ],
    fuse: [
      'U1'
    ],
    newUnitId: 'FUSED',
    mustReject: true,
    expectedErrorContains: 'at least two token units'
  }
]

// vectors.buffer_withdraw_fresh_remainder.tests
export const BUFFER_WITHDRAW_FRESH_REMAINDER_TESTS = [
  {
    name: 'partial_withdraw_fresh_remainder',
    sourceBalance: 50,
    amount: 20,
    expectedIsotopes: [
      'B',
      'V',
      'B'
    ],
    expectedSourceValue: '-50',
    expectedRecipientValue: '20',
    expectedRemainderValue: '30',
    expectedSum: '0',
    expectedRemainderPositionDistinctFromSource: true
  },
  {
    name: 'full_withdraw_fresh_remainder',
    sourceBalance: 50,
    amount: 50,
    expectedIsotopes: [
      'B',
      'V',
      'B'
    ],
    expectedSourceValue: '-50',
    expectedRecipientValue: '50',
    expectedRemainderValue: '0',
    expectedSum: '0',
    expectedRemainderPositionDistinctFromSource: true
  }
]
