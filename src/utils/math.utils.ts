export class MathUtils {
  floorNumStrByOrder(str: string): string {
    const strLen = str.length;

    if (str.split('').every((dig) => dig === '0')) {
      return str;
    } else if (str.lastIndexOf('.') === strLen - 2) {
      return Math.floor(+str) + '';
    } else if (str.indexOf('.') !== -1) {
      return str.slice(0, -1);
    } else if (str.indexOf('0') === -1) {
      return str.slice(0, -1) + '0';
    } else {
      const zeroIndex = str.lastIndexOf('0');

      return str.slice(0, zeroIndex - 1) + '0'.repeat(strLen - zeroIndex + 1);
    }
  }
  
  calcClosestMultiple(divider: number, dividend: number): number {
    let ascDivider: number = divider;
    let descDivider: number = divider;

    while (
      !(dividend % ascDivider === 0) &&
      !(dividend % descDivider === 0)
    ) {
      ascDivider += 1;
      descDivider -= 1;
    }

    const result: number = dividend % ascDivider === 0 ?
      ascDivider :
      descDivider;

    return result;
  }

  cosDeg(deg: number): number {
    const rad: number = this.degToRad(deg);
    const result: number = Math.cos(rad);

    return result;
  }

  sinDeg(deg: number): number {
    const rad: number = this.degToRad(deg);
    const result: number = Math.sin(rad);

    return result;
  }

  findPrimeFactors(value: number): number[] {
    if (value < 2) return [];

    let tempValue: number = value;
    let checker: number = 2;
    const result: number[] = [];

    while (checker * checker <= tempValue) {
      if (tempValue % checker === 0) {
        result.push(checker);
        tempValue /= checker;
      } else {
        checker += 1;
      }
    }

    if (tempValue !== 1) {
      result.push(tempValue);
    }

    return result;
  }

  calcAreaCorrectionGrowthCoofs(value: number): number[] {
    const primeFactors = this.findPrimeFactors(value);
    primeFactors.pop();
    const result: number[] = [];

    primeFactors.forEach((value) => {
      if (value <= 2) {
        result.push(value);
      } else {
        result.push(2);
        result.push(value / 2);
      }
    });

    return result;
  }

  degToRad(deg: number): number {
    return deg * Math.PI / 180;
  }

  radToDeg(rad: number): number {
    return rad * 180 / Math.PI;
  }

  decRemain(value: number): number {
    return value - Math.floor(value);
  }
}
