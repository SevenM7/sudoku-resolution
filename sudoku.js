var SIZE_BOARD = 9

/*let board = [
    [0, 0, 0,   0, 0, 0,   0, 0, 0],
    [0, 0, 0,   0, 0, 0,   0, 0, 0],
    [0, 0, 0,   0, 0, 0,   0, 0, 0],

    [0, 0, 0,   0, 0, 0,   0, 0, 0],
    [0, 0, 0,   0, 0, 0,   0, 0, 0],
    [0, 0, 0,   0, 0, 0,   0, 0, 0],

    [0, 0, 0,   0, 0, 0,   0, 0, 0],
    [0, 0, 0,   0, 0, 0,   0, 0, 0],
    [0, 0, 0,   0, 0, 0,   0, 0, 0]
]*/

let board = [
    [3, 0, 0,   0, 6, 0,   0, 0, 0],
    [6, 5, 8,   7, 0, 0,   3, 0, 0],
    [0, 9, 7,   8, 0, 0,   0, 0, 2],

    [0, 6, 0,   0, 3, 0,   0, 4, 0],
    [9, 0, 0,   0, 0, 0,   6, 0, 0],
    [0, 0, 0,   0, 0, 0,   0, 7, 8],

    [0, 0, 0,   0, 0, 7,   0, 0, 0],
    [4, 0, 0,   0, 0, 0,   0, 0, 7],
    [0, 0, 2,   5, 0, 9,   0, 0, 0]
]

let board_info = {
    ps_x : newBoard(),
    ps_y : newBoard(),
    ps_qt: newBoard(),
    ps_xy: new Map()
}

let indeterminate = []

function newBoard() {
    let result = []

    for (let i = 0; i < SIZE_BOARD; i++) {
        result[i] = from1to9()
    }

    return result
}

function from1to9() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9]
}

function resolverXY(x, y) {
    let quadrant = board_info.ps_qt[getIndexQuadrant(x, y)]
    let board_y = board_info.ps_y[y]
    let board_x = board_info.ps_x[x]

    let valuesPS = getPS(x, y).filter(value =>
            quadrant.indexOf(value) > -1
            && board_y.indexOf(value) > -1 
            && board_x.indexOf(value) > -1
    )

    let value

    if (valuesPS.length == 1) {
        value = valuesPS[0]
    } else {
        value = valuesPS.find(value_ps => { 
            return resolverNeighbor(x, y, value_ps) 
        })
    }

    if (value != undefined) {
        removeAt(x, y, value)
        return value
    } 

    putPS(x, y, valuesPS)

    return 0
}

function resolverNeighbor(x, y, value) {
    let quadrant = getIndexQuadrant(x, y)

    let position = {
        y: ((quadrant / 3) >> 0) * 3,
        x: ((quadrant % 3) * 3)
    }

    for (let _y = position.y; _y < position.y + 3; _y++) {
        for (let _x = position.x; _x < position.x + 3; _x++) {
            if ((_y == y && _x == x) || board[_y][_x] > 0){
                continue
            }

            // testa se tem possiveis soluções nos vizinhos, se não só o x e y tem aquele valor
            if(getPS(_x, _y).some(value_ps => value_ps == value)) {
                return false
            }
        }
    }

    return true
}

function removeAt(x, y, value) {
    // remove from quadrant
    board_info.ps_qt[getIndexQuadrant(x, y)] = board_info.ps_qt[getIndexQuadrant(x, y)].filter(value_qt => value_qt != value)
    board_info.ps_y[y] = board_info.ps_y[y].filter(value_y => value_y != value)
    board_info.ps_x[x] = board_info.ps_x[x].filter(value_x => value_x != value)
}

function getPS(x, y) {
    let valuesPS = board_info.ps_xy[`${x}x${y}`]

    if (valuesPS == undefined) {
        valuesPS = from1to9()
    }

    return valuesPS
}

function putPS(x, y, valuesPS) {
    board_info.ps_xy[`${x}x${y}`] = valuesPS
}

function getIndexQuadrant(x, y) {
    return (
        (((y / 3) >> 0) * 3) + ((x / 3) >> 0)
    )
}

function init() {
    for (let y = 0; y < SIZE_BOARD; y++) {
        for (let x = 0; x < SIZE_BOARD; x++) {
            let value = board[y][x]

            if (value > 0) {
                removeAt(x, y, value)
            } else {
                indeterminate.push({'x': x, 'y': y})
            }
        }
    }
}

function resolver() {
    let repeat = false

    indeterminate = indeterminate.filter(value => {
        let resolved = resolverXY(value.x, value.y) 

        console.log(resolved)

        if (resolved > 0) { 
            board[value.y][value.x] = resolved
            repeat = true
            return false
        }

        return true
    })

    //if (indeterminate.length > 0) {
        // backtracking
        //let lastBoardInfo = Object.assign({}, board_info)
        //let lastBoard = Object.assign({}, board)
    //}

    return repeat
}

function fix() {
    while(resolver()) {

    }

    return indeterminate.length == 0
}

init()