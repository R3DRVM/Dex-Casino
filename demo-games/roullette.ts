class Roulette {
  private readonly _table: number[] = [];

  constructor(table: number[]) {
    this._table = table;
  }

  spin(): number {
    return this._table[Math.floor(Math.random() * this._table.length)];
  }
}

const roulette = new Roulette([0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26]);
console.log(roulette.spin());
