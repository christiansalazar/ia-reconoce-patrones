
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
    { id:'E', x: 4, y: 4, v: [ 
        1, 0, 0, 0, 
        1, 1, 0, 0, 
        0, 0, 1, 0, 
        0, 0, 0, 1, 
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

function compareMatrix(m1, m2, sensibility){
    // retorna un valor decimal entre 0 y 1
    // mientras mas se acerque al 1 mas parecida es m1 de m2

    let k1 = 0.0, k2 = 0.0;

    for(let j=0;j<m1.y;j++){
        for(let i=0;i<m1.x;i++){
            let offset = m1.y * j + i;
            let k = (i+1)*(j+1);
            k1 += k;
            
            let diff = Math.abs(m1.v[offset] - m2.v[offset]);

            if(diff <= sensibility) {
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
            //mA.v[offset] = (v >= 0.1) ? 1 : 0;
        }
    }
        
    return mA;
}

function transformMatrix2(matrix, newSize) {

    return transformMatrix(matrix, newSize / matrix.x);
}

function runGeneration(inputMatrix, matrixSize, patterns_list, sensibility) {
  
    let R = [];

    let transformedMatrix = transformMatrix2(inputMatrix, matrixSize);

    for(let p of patterns_list){
        
        let transformedPatternMatrix = transformMatrix2(p, matrixSize);

        let match = compareMatrix(
            transformedMatrix, transformedPatternMatrix, sensibility);
        
        if(match) {
            R.push(p);
        }
    }

    let ids='';
    for(let p of R){ ids += p.id+","; }
    console.log("generation: ", "P="+P, "S="+sensibility.toFixed(5), ids);
    return R;
}

let P = 2;
let end = false;
let result = null;
let defaultSensibility = 0.01;
let sensibility = defaultSensibility;
let selectedPatterns = JSON.parse(JSON.stringify(patterns));

do {

    let patternsMatched = runGeneration(input, P, selectedPatterns, sensibility);
    
    if(patternsMatched.length == 1) {
        end = true;
        result = patternsMatched[0];
    }else{
      
        if(patternsMatched.length > 0) {
        
            selectedPatterns = patternsMatched; 
                
            P += 1;
            if(P > input.x) {
                end = true;
            }
        
        }else{

            // en cada generacion mejora la sensibilidad y la dimension P

            sensibility+=0.01;

            if(sensibility > 0.2) {
                
                sensibility = defaultSensibility;
                P += 1;
                if(P > input.x) {
                    end = true;
                }
            }
        }
    }

}while(end == false);

console.log("result=", result ? result.id : 'not found');
