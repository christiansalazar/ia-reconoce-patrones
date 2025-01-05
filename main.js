
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

function compareMatrix(m1, m2){
    // retorna un valor decimal entre 0 y 1
    // mientras mas se acerque al 1 mas parecida es m1 de m2

    let k1 = 0.0, k2 = 0.0;

    for(let j=0;j<m1.y;j++){
        for(let i=0;i<m1.x;i++){
            let offset = m1.y * j + i;
            let k = (i+1)*(j+1);
            k1 += k;
            if(m1.v[offset] == m2.v[offset]) {
                k2 += k;
            }
        }
    }

    return k2 / k1; 
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

    for(let j=0;j<h2;j++){
        for(let i=0;i<w2;i++){
            let offset = j*mA.y + i;
            let v = (mB.v[offset]) ? (mA.v[offset] / mB.v[offset]) : 0; 
            mA.v[offset] = (v >= 0.1) ? 1 : 0;
        }
    }
        
    return mA;
}

function transformMatrix2(matrix, newSize) {

    return transformMatrix(matrix, newSize / matrix.x);
}

function runGeneration(inputMatrix, matrixSize, patterns_list) {
  
    let R = [];

    let transformedMatrix = transformMatrix2(inputMatrix, matrixSize);

    for(let p of patterns_list){
        
        let transformedPatternMatrix = transformMatrix2(p, matrixSize);

        let comp = compareMatrix(transformedMatrix, transformedPatternMatrix);
        
        // filtro de sensibilidad de la comparacion entre las dos matrices
        let dif = Math.abs(1.0 - comp);
        if(dif <= 0.1) {
            R.push(p);
        }
    }

    return R;
}

let result = null;
let P = 2;
let resultPatterns = runGeneration(input, P, patterns);
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
            resultPatterns = runGeneration(input, P, resultPatterns);
        }
    }
}
console.log("result=", result ? result.id : 'not found');
