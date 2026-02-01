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

const validKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

function selectTile(e) {
  // Deselect any tile that has already been selected
  const selectedTile = document.querySelector(".tile[selected]");
  selectedTile?.removeAttribute("selected");

  // Now select your chosen tile
  e.target.toggleAttribute("selected");
}

function checkRow(tile) {
  let numbersInRow = [];
  const tileRowNumber = tile.dataset["row"];
  const tilesInRow = document.querySelectorAll(
    `.tile[data-row="${tileRowNumber}"]`,
  );

  // Mark the whole row as being invalid if there is even a single duplicate present
  let rowInvalid = false;
  [...tilesInRow].every((t) => {
    if (
      numbersInRow.find((number) => {
        return number === t.innerText;
      })
    ) {
      rowInvalid = true;
      return false;
    } else {
      numbersInRow.push(t.innerText);
    }

    return true;
  });

  if (rowInvalid) {
    tilesInRow.forEach((t) => {
      t.classList.add("invalid-row");
    });
  } else {
    // As soon as the row is fixed up, mark it as valid
    tilesInRow.forEach((t) => {
      t.classList.remove("invalid-row");
    });
  }
}

function checkColumn(tile) {
  let numbersInColumn = [];
  const tileColumnNumber = tile.dataset["column"];
  const tilesInColumn = document.querySelectorAll(
    `.tile[data-column="${tileColumnNumber}"]`,
  );

  // Mark the whole column as being invalid if there is even a single duplicate present
  let columnInvalid = false;
  [...tilesInColumn].every((t) => {
    if (
      numbersInColumn.find((number) => {
        return number === t.innerText;
      })
    ) {
      columnInvalid = true;
      return false;
    } else {
      numbersInColumn.push(t.innerText);
    }

    return true;
  });

  if (columnInvalid) {
    tilesInColumn.forEach((t) => {
      t.classList.add("invalid-column");
    });
  } else {
    // As soon as the column is fixed up, mark it as valid
    tilesInColumn.forEach((t) => {
      t.classList.remove("invalid-column");
    });
  }
}

function setTileNumber(number) {
  const selectedTile = document.querySelector(".tile[selected]");
  selectedTile.innerText = number;
  selectedTile.toggleAttribute("selected");
  checkRow(selectedTile);
  checkColumn(selectedTile);
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
        // Ensure that only tiles blank from the start can be selected
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

document.addEventListener("keydown", (e) => {
  // Handle insertion of numbers to solve the puzzle
  const keyValue = e.key;
  if (
    validKeys.find((value) => {
      return value === keyValue;
    })
  ) {
    setTileNumber(e.key);
  }
});

createSudokuGrid();
