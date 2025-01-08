
const caracteres = [
  { codigo: 0x25A0, simbolo: String.fromCharCode(0x25A0) }, // █ (cuadro relleno completo)
  { codigo: 0x25A1, simbolo: String.fromCharCode(0x25A1) }, // □ (cuadro vacío)
  { codigo: 0x25AA, simbolo: String.fromCharCode(0x25AA) }, // ▪ (cuadro pequeño relleno)
  { codigo: 0x25AB, simbolo: String.fromCharCode(0x25AB) }, // ▫ (cuadro pequeño vacío)
  { codigo: 0x25FE, simbolo: String.fromCharCode(0x25FE) }, // ▿ (triángulo relleno)
  { codigo: 0x2588, simbolo: String.fromCharCode(0x2588) }, // ▉ (cuadro relleno)
  { codigo: 0x2591, simbolo: String.fromCharCode(0x2591) }, // ░ (cuadro sombreado ligero)
  { codigo: 0x2592, simbolo: String.fromCharCode(0x2592) }, // ▒ (cuadro sombreado mediano)
  { codigo: 0x2593, simbolo: String.fromCharCode(0x2593) }, // ▓ (cuadro sombreado completo)
  { codigo: 0x25B6, simbolo: String.fromCharCode(0x25B6) }, // ▶ (triángulo hacia la derecha)
  { codigo: 0x25B7, simbolo: String.fromCharCode(0x25B7) },  // ▷ (triángulo avanzado)
];

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

function compareMatrix(m1, m2, sensibility=0.1){
    // retorna un valor decimal entre 0 y 1
    // mientras mas se acerque al 1 mas parecida es m1 de m2
    
    let k1 = 0.0, k2 = 0.0;
    
    for(let i=0;i<m1.v.length;i++){
        let diff = Math.abs(m1.v[i] - m2.v[i]);
        k1 += (i+1);
        if(diff <= sensibility) {
            k2 += (i+1);
        }
    }
    
    return k2 / k1; 
}

function charByColorLevel(character, value) {
    value = Math.max(0, Math.min(10, value));
    const intensity = Math.floor((value / 10) * 255);  // Escala de 0 a 255
    const redColorCode = `\x1b[38;2;${intensity};0;0m`; // Código ANSI para color rojo con intensidad
    return `${redColorCode}${character}\x1b[0m`;
}

function printMatrix(matrix, useValue=false) {
    
    let s = "", sep='';
    let trimValue = 2;

    for(let j=0; j<matrix.y;j++){
        sep='';
        if(j>0){ s += '\n'; }
        for(let i=0; i<matrix.x; i++){
            let v = matrix.v[matrix.y*j + i];
            
            if(true == useValue){
                s += sep + v;
                sep = ',';
            }else{
                if(v > trimValue){ v = trimValue; }    
                let level = (10 * v)/trimValue;

                s += sep + charByColorLevel(String.fromCharCode(0x2588), level);
            }
        }
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

function runGeneration(NG, inputMatrix, matrixSize, patterns_list, 
    matrixSensibility, compareSensibility) {
  
    let R = [];

    console.log("[gen "+NG+"]", matrixSize, matrixSensibility.toFixed(4), compareSensibility);

    let transformedMatrix = transformMatrix2(inputMatrix, matrixSize);
    
    console.log(printMatrix(transformedMatrix));
    
    console.log(">");

    for(let p of patterns_list){
        
        let transformedPatternMatrix = transformMatrix2(p, matrixSize);

        let match = compareMatrix(
            transformedMatrix, transformedPatternMatrix, matrixSensibility);
    
        console.log(p.id, "match="+match);
        console.log(printMatrix(transformedPatternMatrix));
        
        if(match >= compareSensibility) {
            console.log("+"+p.id);
            R.push(p);
        }else{
            console.log("-"+p.id+"("+match+")");
        }
    }

    return R;
}

let P = 2;
let end = false;
let result = null;
let defaultSensibility = 0.01;
let sensibility = defaultSensibility;
let selectedPatterns = JSON.parse(JSON.stringify(patterns));

let NG=0;
    
console.log(printMatrix(input));
console.log("generaciones:");

do {

    NG++;

    let patternsMatched = runGeneration(NG,
        input, P, selectedPatterns, sensibility, 0.9);

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

            if(sensibility > 1) {
                
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
