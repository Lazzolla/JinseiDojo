const list = [
  { rank: "6to Kyu (cinturón blanco)", index: 0, beltBg: '../../../pictures/rankBackgrounds/belts/white.png' },
  { rank: "5to Kyu (cinturón amarillo)", index: 1, beltBg: '../../../pictures/rankBackgrounds/belts/yellow.png' },
  { rank: "4to Kyu (cinturón naranja)", index: 2, beltBg: '../../../pictures/rankBackgrounds/belts/orange.png' },
  { rank: "3er Kyu (cinturón verde)", index: 3, beltBg: '../../../pictures/rankBackgrounds/belts/green.png' },
  { rank: "2do Kyu (cinturón azul)", index: 4, beltBg: '../../../pictures/rankBackgrounds/belts/blue.png' },
  { rank: "1er Kyu (cinturón marron)", index: 5, beltBg: '../../../pictures/rankBackgrounds/belts/brown.png' },
  { rank: "1er Dan (Shodan)", index: 6, beltBg: '../../../pictures/rankBackgrounds/belts/black1.png' },
  { rank: "2do Dan (Nidan)", index: 7, beltBg: '../../../pictures/rankBackgrounds/belts/black1.png' },
  { rank: "3ro Dan (Sandan)", index: 8, beltBg: '../../../pictures/rankBackgrounds/belts/black2.png' },
  { rank: "4to Dan (Yondan)", index: 9, beltBg: '../../../pictures/rankBackgrounds/belts/black2.png' },
  { rank: "5to Dan (Godan)", index: 10, beltBg: '../../../pictures/rankBackgrounds/belts/black3.png' },
  { rank: "6to Dan (Rokudan)", index: 11, beltBg: '../../../pictures/rankBackgrounds/belts/black3.png' },
  { rank: "7mo Dan (Shichidan)", index: 12, beltBg: '../../../pictures/rankBackgrounds/belts/black3.png' },
  { rank: "8vo Dan (Hachidan)", index: 13, beltBg: '../../../pictures/rankBackgrounds/belts/black3.png' },
  { rank: "9no Dan (Kudan)", index: 14, beltBg: '../../../pictures/rankBackgrounds/belts/black3.png' },
  { rank: "10mo Dan (Judan)", index: 15, beltBg: '../../../pictures/rankBackgrounds/belts/black3.png' }
]
export function getRanksList() {
  return list
}

export function getIndex(userRank) {
  const item = list.find(el => el.rank === userRank)
  return item.index
}
export function getRanks(userRank) {
  const item = list.find(el => el.rank === userRank)
  let ranks = []
  for (let x = 0; x <= item.index; x++) {
    ranks.push(list[x].rank)
  }
  return ranks
}
export function SeparateArrayInGroups(list, groupLength) {
  let index = 0, result = []
  while (index < list.length) {
    if (index % groupLength === 0)
      result.push([])
    result[result.length - 1].push(list[index++])
  }
  return result
}