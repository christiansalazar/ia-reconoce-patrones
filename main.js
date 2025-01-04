
let input = null;
let patterns = [
    { id:'A', x: 4, y: 4, v: [ 
        0, 0, 1, 0, 
        0, 0, 1, 1, 
        1, 1, 1, 0, 
        0, 0, 0, 0, 
    ]}, 
    { id:'B', x: 4, y: 4, v: [ 
        1, 0, 0, 0, 
        0, 1, 0, 0, 
        0, 0, 1, 0, 
        0, 0, 0, 1, 
    ]}, 
    { id:'C', x: 4, y: 4, v: [ 
        0, 0, 0, 1, 
        0, 0, 1, 0, 
        0, 1, 0, 0, 
        1, 0, 0, 0, 
    ]}, 
    { id:'D', x: 4, y: 4, v: [ 
        1, 1, 0, 0, 
        0, 1, 0, 0, 
        0, 0, 1, 0, 
        0, 0, 1, 1, 
    ]}, 
];

input = { x: 8, y: 8, v: [
 0, 0, 0, 0, 0, 0, 0, 0,
 0, 1, 0, 0, 0, 0, 0, 0,
 0, 0, 1, 0, 0, 0, 0, 0,
 0, 0, 1, 1, 0, 0, 0, 0,
 0, 0, 0, 0, 1, 1, 0, 0,
 0, 0, 0, 1, 0, 1, 0, 0,
 0, 0, 0, 0, 0, 0, 1, 0,
 0, 0, 0, 0, 0, 0, 0, 0,
]};

function compareMatrix(matrix_a, matrix_b) {
    for(let i=0; i<matrix_a.v.length; i++){
        if(matrix_a.v[i] !== matrix_b.v[i]){
            return false;
        }
    }
    return true;
}

function printMatrix(matrix) {
    let s = "", sep='',n=0;
    for(let i=0; i<matrix.y;i++){
        sep='';
        for(let j=0; j<matrix.x;j++){
            s += sep + matrix.v[n++];
            sep = ',';
        }
        s+="\n";
    }
    return s;
}

function newMatrix(x,y) {
    let m = { x: x, y:y, v:[] };
    for(let i=0;i<(x*y);i++){ 
        m.v.push(0); 
    } 

    return m;
}

function transformMatrix(matrix, weight) {
    let w2 = Math.trunc(matrix.x * weight);
    let h2 = Math.trunc(matrix.y * weight);
    let mA = newMatrix(w2, h2);
    let mB = newMatrix(w2, h2);

    for(let j=0; j<matrix.y; j++){
        for(let i=0; i<matrix.x; i++){
            
            let v = matrix.v[j*matrix.y + i];
            let jj = Math.trunc(j * weight);
            let ii = Math.trunc(i * weight);
            let offset = jj*mA.y + ii;

            mA.v[offset] += v; 
            mB.v[offset] ++; 
        }
    }

    // filtro por ruido
    for(let j=0;j<h2;j++){
        for(let i=0;i<w2;i++){
            let offset = j*mA.y + i;
            let v = (mB.v[offset]) ? (mA.v[offset] / mB.v[offset]) : 0; 
            mA.v[offset] = (v >= 0.2) ? 1 : 0;
        }
    }
        
    return mA;
}

function transformMatrix2(matrix, newSize) {

    return transformMatrix(matrix, newSize / matrix.x);
}

function scan(inputMatrix, matrixSize, patterns_list) {
   
    let R = [];

    let transformedMatrix = transformMatrix2(inputMatrix, matrixSize);

    for(let p of patterns_list){
        
        let transformedPatternMatrix = transformMatrix2(p, matrixSize);

        let match = compareMatrix(transformedMatrix, transformedPatternMatrix);
    
        if(match) {
            R.push(p);
        }
    }

    return R;
}

let result = null;
let P = 2;
let resultPatterns = scan(input, P, patterns);
let end=false;
while(!end){
    if(1 == resultPatterns.length){
        end=true;
        result = resultPatterns[0];
    }else{
        P += 1;
        if(P > input.x){
            end=true;
        }else{
            resultPatterns = scan(input, P, resultPatterns);
        }
    }
}
console.log("result=", result.id);
