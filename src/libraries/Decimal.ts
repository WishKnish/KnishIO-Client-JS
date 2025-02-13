// Value determines by min sql decimal precision
const multiplier: number = 10 ** 18

export default class Decimal {
  static val (value: number): number {
    if (Math.abs(value * multiplier) < 1) {
      return 0.0
    }
    return value
  }

  static cmp (value1: number, value2: number): number {
    const val1 = Decimal.val(value1) * multiplier
    const val2 = Decimal.val(value2) * multiplier

    // Equal
    if (Math.abs(val1 - val2) < 1) {
      return 0
    }

    // Greater or smaller
    return (val1 > val2) ? 1 : -1
  }

  static equal (value1: number, value2: number): boolean {
    return (Decimal.cmp(value1, value2) === 0)
  }
}
