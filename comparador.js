// rutina de comparacion de matrices
// rango de resultado: 0 a 1 (con decimales)
//

let patterns = [
    { x: 4, y: 4, v: [ 
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1,
    ] },
    { x: 4, y: 4, v: [ 
        0,0,0,1,
        0,0,1,0,
        0,1,0,0,
        1,0,0,0,
    ] },
    { x: 4, y: 4, v: [ 
        1,0,0,0,
        0,1,1,0,
        0,0,0,0,
        0,0,0,1,
    ] },
    { x: 4, y: 4, v: [ 
        1,0,0,0,
        0,1,0,0,
        0,0,0,0,
        0,0,0,1,
    ] },
    { x: 4, y: 4, v: [ 
        0,0,0,0,
        0,1,0,0,
        0,0,0,0,
        0,0,0,1,
    ] },
];
    
let t1 = { x: 4, y: 4, v: [ 
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1,
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

for(let p of patterns){
    console.log(compareMatrix(t1, p));
}


