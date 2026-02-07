// Answer is in p141, Page 22 Sudoku Easy section
const numbers = [
  ["", "", "", "5", "6", "", "", "", ""],
  ["", "", "9", "", "2", "1", "4", "6", ""],
  ["", "3", "1", "", "", "", "", "", "9"],
  ["5", "9", "7", "", "", "3", "6", "", ""],
  ["1", "", "", "9", "", "7", "", "", "2"],
  ["", "", "3", "4", "", "", "9", "1", "7"],
  ["4", "", "", "", "", "", "7", "3", ""],
  ["", "8", "6", "7", "4", "", "2", "", ""],
  ["", "", "", "", "3", "2", "", "", ""],
];

const validKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const squareLength = 3;
const squareCountLengthways = 3;

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

// TODO: Fix bug where two 3s are in a column in the top right square,
//       but the top right square is meant to be marked as invalid and it isn't.
function checkSquare(tile) {
  const tileRowNumber = tile.dataset["row"];
  const tileColumnNumber = tile.dataset["column"];
  const tileNumber = tile.innerText;

  // Create the possible boundary coordinates for
  // each square
  const boundaries = [];
  let i = 0;
  let boundaryCoordinate = 0;
  while (i < squareCountLengthways) {
    boundaries.push(boundaryCoordinate);
    boundaryCoordinate += squareLength;
    i++;
  }

  // Find the starting point based on the tile chosen
  i = boundaries.length - 1;
  let lowerBoundaryRow;
  while (i >= 0) {
    if (boundaries[i] <= tileRowNumber) {
      lowerBoundaryRow = boundaries[i];
      break;
    }

    i--;
  }

  i = boundaries.length - 1;
  let lowerBoundaryColumn;
  while (i >= 0) {
    if (boundaries[i] <= tileColumnNumber) {
      lowerBoundaryColumn = boundaries[i];
      break;
    }

    i--;
  }

  // Find the end point
  const upperBoundaryRow = lowerBoundaryRow + squareLength - 1;
  const upperBoundaryColumn = lowerBoundaryColumn + squareLength - 1;

  // Mark the whole square as invalid if even a single number is duplicated
  let squareInvalid = false;
  for (i = lowerBoundaryRow; i <= upperBoundaryRow; i++) {
    for (j = lowerBoundaryColumn; j <= upperBoundaryColumn; j++) {
      if (i == tileRowNumber && j == tileColumnNumber) {
        // Don't check the tile the user selected
        break;
      }

      let currentTile = document.querySelector(
        `.tile[data-row="${i}"][data-column="${j}"]`,
      );
      if (currentTile.innerHTML === tileNumber) {
        squareInvalid = true;
        break;
      }
    }
  }

  for (i = lowerBoundaryRow; i <= upperBoundaryRow; i++) {
    for (j = lowerBoundaryColumn; j <= upperBoundaryColumn; j++) {
      let currentTile = document.querySelector(
        `.tile[data-row="${i}"][data-column="${j}"]`,
      );
      if (squareInvalid) {
        currentTile.classList.add("invalid-square");
      } else {
        // As soon as the duplicate numbers are removed, mark the square as valid again
        currentTile.classList.remove("invalid-square");
      }
    }
  }
}

function gameWon() {
  // Ensure every tile that started off as blank has been filled in and that there are no errors
  // present
  const tiles = document.querySelectorAll(".tile[started-as-blank]");

  const hasWon = [...tiles].every((tile) => {
    if (tile.innerText === "") {
      return false;
    } else {
      switch (true) {
        case tile.classList.contains("invalid-square"):
        case tile.classList.contains("invalid-row"):
        case tile.classList.contains("invalid-column"):
          return false;
      }
    }

    return true;
  });

  return hasWon;
}

function makeMove(number) {
  const selectedTile = document.querySelector(".tile[selected]");
  selectedTile.innerText = number;
  selectedTile.toggleAttribute("selected");

  checkRow(selectedTile);
  checkColumn(selectedTile);
  checkSquare(selectedTile);

  if (gameWon()) {
    document.querySelector(".winner").classList.add("show-up");
  }
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

      if (tile === "") {
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
    makeMove(e.key);
  }
});

document.querySelector(".start-over").addEventListener("click", () => {
  const tiles = document.querySelectorAll(".tile");

  tiles.forEach((tile) => {
    // Any tiles that were originally blank need to be made blank again
    const wasBlank = tile.hasAttribute("started-as-blank");
    if (wasBlank) {
      tile.innerText = "";
    }

    // Reset any validations triggered on tiles
    tile.classList.remove("invalid-square");
    tile.classList.remove("invalid-row");
    tile.classList.remove("invalid-column");
  });
});

createSudokuGrid();
