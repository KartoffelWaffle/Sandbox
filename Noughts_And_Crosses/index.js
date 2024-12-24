//
// NOUGHTS & CROSSES
//

function PlacePiece(grid, piece, position) {

    let {x,y} = position;
    let check = grid[y][x];

    if(check != 0) {
        return false;
    }

    grid[y][x] = piece;

    if(diagonal_map.get(`${y},${x}`) === 0) {
        diagonal_map.set(`${y},${x}`,piece);
    }
    return true;

}

function PopulateGrid(gridXLength, gridYLength) {

    const diagonalMap = new Map();
    const grid = [];
    let offsetOne = 0, offsetTwo = gridXLength - 1;

    for(let i = 0; i < gridYLength; i++) {
        
        let row = [];
        
        for (let j = 0; j < gridXLength; j++) {
            row.push(0);
        }

        grid.push(row);

        if(offsetOne === offsetTwo) {
            diagonalMap.set(offsetOne + "," + offsetTwo,0);
        }
        else {
            diagonalMap.set(offsetOne + "," + i,0);
            diagonalMap.set(i + "," + offsetTwo,0);
        }
        offsetOne++;
        offsetTwo--;
    }

    return {"grid":grid, "diagonal_map": diagonalMap};
}

function CheckNeighbours(piece,position,diagonal_map,grid) {

    if(diagonal_map.get(`${position.y},${position.x}`)) {

        let left_diagonal_check = {"x":0,"y":0};
        let right_diagional_check = {"x":2,"y":0};

        if(LinearCheck(left_diagonal_check,1,1,gridXLength,gridYLength,grid,piece) || LinearCheck(right_diagional_check,-1,1,gridXLength,gridYLength,grid,piece)) {return true;}
    }

    return (LinearCheck(position,0,1,gridXLength,gridYLength,grid,piece) || LinearCheck(position,1,0,gridXLength,gridYLength,grid,piece));

}

function LinearCheck(postion,xAdder,yAdder,gridXLength,gridYLength,grid,piece) {
    let {x,y} = postion;
    for(let i = 0; i < grid.length; i++) {

        if(x > (gridXLength-1)) {x = 0;}
        if(y > (gridYLength-1)) {y = 0;}

        if(grid[y][x] != piece) {
            return false;
        }
        x = x + xAdder;
        y = y + yAdder;
    }
    return true;
}

function DrawGrid(grid) {
    for(let i = 0; i < grid.length; i++) {
        let row = "";
        for(let j = 0; j < grid[i].length; j++) {
            row = row + ` ${grid[i][j]} `;
        }
        console.log(row);
    }
}

function ChangePosition(position,grid) {
    let {x,y} = position;

    for(let i = 0; i < grid.length; i++) {

        let row = "\x1b[0m";

        for(let j = 0; j < grid[i].length; j++) {

            let text_content = " ";

            if(grid[i][j]) {text_content = grid[i][j]}
            if(j === 1) {
                if(x===j && y===i) {
                    row = row + `|\x1b[42m ${text_content} \x1b[0m|`;
                }
                else {
                    row = row + `| ${text_content} |`;
                }
            }
            else {
                if(x===j && y===i) {
                    row = row + `\x1b[42m ${text_content} \x1b[0m`;
                }
                else {
                    row = row + ` ${text_content} `;
                }
            }
        }
        console.log(row);
        if(i != 2) {
            console.log("-----------");
        }
    }
}

const stdin = process.stdin;
stdin.setRawMode(true);
stdin.setEncoding('utf8');

let gridXLength = 3, gridYLength = 3;
let {grid, diagonal_map} = PopulateGrid(gridXLength,gridYLength);

let current_position = {"x":0,"y":0};
let current_player = "X";

let moves_made = 0;

console.clear();
ChangePosition(current_position, grid);

stdin.on('data', (key) => {
    console.clear();
    if ( key === '\u0003' ) {
      process.exit();
    }
    if (key === '\u001b[D') {
        if(current_position.x != 0) {
            current_position.x = current_position.x-1;
        }
        ChangePosition(current_position,grid);
    }
    if (key === '\u001b[A') {
        if(current_position.y != 0) {
            current_position.y = current_position.y-1;
        }
        ChangePosition(current_position,grid);
    }
    if (key === '\u001b[B') {
        if(current_position.y != gridYLength-1) {
            current_position.y = current_position.y+1;
        }
        ChangePosition(current_position,grid);
    }
    if(key === '\u001b[C') {
        if(current_position.x != gridXLength-1) {
            current_position.x = current_position.x+1;
        }
        ChangePosition(current_position,grid);
    }
    if(key === "\r") {
        let move_made = PlacePiece(grid,current_player,current_position);
        if(move_made) {
            moves_made++;
            let win = CheckNeighbours(current_player,current_position,diagonal_map,grid);
            if(win) {
                console.log(`${current_player} Wins!`);
                process.exit();
            }
            if(current_player === "X") {current_player = "O";} else {current_player = "X";}
        }
        if(moves_made === 9) {
            console.log("Nobody wins, you're both shit.");
            process.exit();
        }
        current_position = {"x":0,"y":0};
        ChangePosition(current_position,grid);
    }
});