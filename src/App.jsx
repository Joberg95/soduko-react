import { useState } from "react";

const resetGrid = () => [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

function App() {
  const [grid, setGrid] = useState(resetGrid());

  function clearBoard() {
    setGrid(resetGrid());
  }

  function setGridValue(rowIndex, cellIndex, value) {
    const newGrid = [...grid];
    newGrid[rowIndex][cellIndex] = value;
    setGrid(newGrid);

    console.log(newGrid);
  }

  async function solveSudoku() {
    let sudokuAsString = "";
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      for (let cellIndex = 0; cellIndex < grid[rowIndex].length; cellIndex++) {
        const value = grid[cellIndex][rowIndex];
        sudokuAsString += value === 0 ? "." : value;
      }
    }

    const response = await fetch(
      // localhost:9090 = cors proxy server
      "http://localhost:9090/http://localhost:5000",
      {
        body: JSON.stringify({
          sudoku: [sudokuAsString],
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
    const json = await response.json();
    const solution = json.data[0].solution;
    const newGrid = new Array(9).fill(0).map(() => new Array(9).fill(0));

    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      for (let cellIndex = 0; cellIndex < grid[rowIndex].length; cellIndex++) {
        newGrid[rowIndex][cellIndex] = parseInt(
          solution[rowIndex * 9 + cellIndex]
        );
      }
    }

    setGrid(newGrid); // update state
  }

  return (
    <div className="App grid justify-center mt-[5rem]">
      <div className="flex justify-center text-[2rem] mb-[1rem]">
        <h1>Soduko</h1>
      </div>
      <div className="grid grid-cols-9 w-[50vh]">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((number, cellIndex) => (
              <div
                key={cellIndex}
                className="cell text-center border h-[3.1rem] mt-[0.5rem] ml-[0.5rem]"
              >
                <input
                  type="number"
                  onChange={(e) =>
                    setGridValue(
                      rowIndex,
                      cellIndex,
                      parseInt(e.target.value) || 0
                    )
                  }
                  value={number}
                  className="w-[3.5rem] h-[2.8rem] text-center"
                />
              </div>
            ))}
          </div>
        ))}

        <div className="row">
          <div className="cell border mt-[2rem] ml-[0.5rem] h-[2rem] w-full text-center">
            <button onClick={solveSudoku}>Solve</button>
          </div>
        </div>

        <div className="row">
          <div className="cell text-center border mt-[2rem] ml-[1rem] w-full h-[2rem]">
            <button onClick={clearBoard}>Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
