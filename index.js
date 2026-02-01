const numbers = [
  [" ", " ", " ", "5", "6", " ", " ", " ", " "],
  [" ", " ", "9", " ", "2", "1", "4", "6", " "],
  [" ", "3", "1", " ", " ", " ", " ", " ", "9"],
  ["5", "9", "7", " ", " ", "3", "6", " ", " "],
  ["1", " ", " ", "9", " ", "7", " ", " ", "2"],
  [" ", " ", "3", "4", " ", " ", "9", "1", "7"],
  ["4", " ", " ", " ", " ", " ", "7", "3", " "],
  [" ", "8", "6", "7", "4", " ", "2", " ", " "],
  [" ", " ", " ", "3", "2", " ", " ", " ", " "],
];

function selectTile(e) {
  // Deselect any tile that has already been selected
  const selectedTile = document.querySelector(".tile[selected]");
  selectedTile?.removeAttribute("selected");

  // Now select your chosen tile
  e.target.toggleAttribute("selected");
}

function createSudokuGrid() {
  const grid = document.querySelector(".board");
  let rowNumber = 0;
  numbers.forEach((row) => {
    const gridRow = document.createElement("tr");
    let columnNumber = 0;
    row.forEach((tile) => {
      const tileElement = document.createElement("td");
      tileElement.classList.add("tile");
      tileElement.setAttribute("data-row", rowNumber);
      tileElement.setAttribute("data-column", columnNumber);
      tileElement.innerText = tile;

      if (tile === " ") {
        // Ensure that only blank tiles can be selected
        tileElement.addEventListener("click", selectTile);
        tileElement.toggleAttribute("started-as-blank");
      }

      gridRow.appendChild(tileElement);

      columnNumber++;
    });
    grid.appendChild(gridRow);
    rowNumber++;
  });
}

createSudokuGrid();
