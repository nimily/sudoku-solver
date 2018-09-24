# Sudoku-solver
A heuristic idea to solve sudokus. We iteratively detect and eliminate impossible values for each cell. For each row, column, or square, we create a bipartite graph where we have one node for each cell and one node for each number from 1-9. A value for a cell is impossible if it does not belong to any perfect matching. The algorithm detect such edges iteratively and disposes of them.

# Executing the code
The code can be used to solve sudokus found on (http://websudoku.com). In order to do so, open the Developer Tools and select the execution context to the iframe containing the sudoku. This can be done by inspecting one of the cells of the table. Then, copy and paste the code found in (./sudoku.js). When main is done, the table will be filled up with the right values.
