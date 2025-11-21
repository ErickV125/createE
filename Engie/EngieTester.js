function Triangulate(face) {
    if (isConcave(face)) {
        face['type'] = 'Concave';//depuracion, por eliminar
        return concave(face);
    } else {
        face['type'] = 'convex';//depuracion, por eliminar
        return convex(face);
    }
}
function isConcave(face) {
    const vertices = face.vertices;
    if (vertices.length < 3) { return false }
    let U = subtract(vertices[1], vertices[0]);
    let V = subtract(vertices[2], vertices[0]);
    let N = normalize(cross(U, V));
    if (magnitude(N) === 0) { return false };
    for (let i = 0; i < vertices.length; i++) {
        let Vprev = vertices[(i - 1 + vertices.length) % vertices.length];
        let Vcurr = vertices[i];
        let VNext = vertices[(i + 1) % vertices.length];
        let A = subtract(Vprev, Vcurr);
        let B = subtract(VNext, Vcurr);
        let C = cross(A, B);
        if (magnitude(C) === 0) { continue };
        let D = dot(C, N);
        if (D < 0) { return true } else
            if (D > 0) { return false }
    }
    return false;
}
function isClockwise(vertices2D) {// no la use
    let sum = 0;
    for (let i = 0; i < vertices2D.length; i++) {
        const v0 = vertices2D[i];
        const v1 = vertices2D[(i + 1) % vertices2D.length];
        sum += (v1[0] - v0[0]) * (v1[1] + v0[1]);
    }
    return sum > 0;
}
function concave(face) {
    let vertices = [...face.vertices];//array
    if (!isClockwise(face.vertices)) {
        vertices.reverse()
    }

    const Triangles = [];
    if (vertices.length === 4) {//por si acaso, no se si funciona...
        Triangles.push([vertices[0], vertices[1], vertices[2]]);
        Triangles.push([vertices[1], vertices[2], vertices[3]]);
    }
    let U = subtract(vertices[1], vertices[0]);
    let V = subtract(vertices[2], vertices[0]);
    let N = normalize(cross(U, V));

    let X = Math.abs(N[0]);
    let Y = Math.abs(N[1]);
    let Z = Math.abs(N[2]);
    let i = 0;
    let axisIgnore = (Z > X && Z > Y) ? 2 : (Y > X && Y > Z) ? 1 : 0//no se usa
    
    while (i < vertices.length && 3 < vertices.length) {

        let A = vertices[(i - 1 + vertices.length) % vertices.length];
        let B = vertices[i];
        let C = vertices[(i + 1) % vertices.length];

        //[A, B, C].forEach(V => V[axisIgnore] = 0);

        let u = subtract(A, B);
        let v = subtract(C, B);
        let localN = normalize(cross(v, u));
        let D = dot(localN, N);

        if (magnitude(D) === 0) { i = 0; continue };
        if (D > 0) {
            let auxVertices = [...vertices];
            auxVertices.splice(i, 1);
            let auxTriangle = [A, B, C];

            if (PointInTriangle(axisIgnore, auxVertices, auxTriangle)) {
                i++;
                continue;
            }
            Triangles.push(auxTriangle);
            vertices.splice(i, 1);


            i = 0
        }
        i++;
        if (vertices.length === 3) {
            Triangles.push([vertices[0], vertices[1], vertices[2]]);
        }
    }
    face['triangles'] = Triangles;
    return Triangles;
}
function PointInTriangle(axisIgnore /*no se usa */, vertices, Triangule) {
    for (let i = 0; i < vertices.length; i++) {
        const vertice = vertices[i];
        let [A, B, C] = Triangule;
        const AB = subtract(B, A);
        const BC = subtract(C, B);
        const CA = subtract(A, C);
        const AP = subtract(vertice, A);
        const BP = subtract(vertice, B);
        const CP = subtract(vertice, C);
        const z1 = cross2D(AB, AP);
        const z2 = cross2D(BC, BP);
        const z3 = cross2D(CA, CP);

        if (Math.sign(z1) === Math.sign(z2) && Math.sign(z2) === Math.sign(z3)) {
            return true;
        }
    }
    return false;


}
function convex(face) {
    let vertices = face.vertices;
    const result = [];
    for (let i = 1; i < vertices.length - 1; i++) {
        result.push([vertices[0], vertices[i], vertices[i + 1]]);
    }
    face['triangles'] = result;
    return result;
}
function Normal(obj) {
    obj.geometry.forEach(face => {
        let N = [0, 0, 0];
        face.triangles.forEach((Triangle) => {
            let U = subtract(Triangle[1], Triangle[0]);
            let V = subtract(Triangle[2], Triangle[0]);
            let Ni = cross(U, V);
            N = add(N, Ni);
        });
        face['Normal'] = normalize(N);
    })
}
function ObjectCenters(obj) {
    let center;
    obj.geometry.forEach(face => {
        center = GeometryCenter(face);
        face["center"] = center;
    });
    return center;
}
function GeometryCenter(face) {
    let x = 0, y = 0, z = 0, n = face.vertices.length;
    face.vertices.forEach(point => {
        x += point[0];
        y += point[1];
        z += point[2];
    })
    return [x / n, y / n, z / n];
}

function AngleNormalToPoint(n, p0, p1) {
    let v = normalize(subtract(p1, p0));
    let cosTheta = dot(n, v);
    let angleRadians = Math.acos(cosTheta);
    let angleDegrees = angleRadians * (180 / Math.PI);
    return angleDegrees;
}

function OperationObject(obj) {
    obj.geometry.forEach((face) => {
        Triangulate(face);
    })
    ObjectCenters(obj);
    Normal(obj);
    CenterObj(figura3D)
}
OperationObject(figura3D);
console.log(figura3D);


function rotateInAxis(obj, angle, axis) {
    const u = normalize(axis);

    function rotatePoint(p) {
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const dotProduct = dot(u, p);
        const crossProduct = cross(u, p);

        return [
            p[0] * cosA + crossProduct[0] * sinA + u[0] * dotProduct * (1 - cosA),
            p[1] * cosA + crossProduct[1] * sinA + u[1] * dotProduct * (1 - cosA),
            p[2] * cosA + crossProduct[2] * sinA + u[2] * dotProduct * (1 - cosA),
        ];
    }

    obj.geometry.forEach(face => {
        face.vertices = face.vertices.map(v => {
            // trasladar al origen (restar centro global)
            let p = subtract(v, obj.center);
            // rotar
            p = rotatePoint(p);
            // trasladar de vuelta
            return add(p, obj.center);
        });
    });
}





function Origin(obj) {
  let sum = [0, 0, 0];
  let count = 0;
  for (const face of obj.geometry) {
    for (const v of face.vertices) {
      sum = add(sum, v);
      count++;
    }
  }
  return scale(sum, 1 / count);
}

// Cálculo del centroide total
function Origin(obj) {
    let sum = [0, 0, 0];
    let count = 0;
    for (const face of obj.geometry) {
        for (const v of face.vertices) {
            sum = add(sum, v);
            count++;
        }
    }
    return scale(sum, 1 / count);
}

function CenterObj(obj) {
    const origin = Origin(obj);
    let totalVolume = 0;
    let centroidSum = [0, 0, 0];

    for (const face of obj.geometry) {
        const verts = face.vertices;
        const tris = face.triangles;

        for (const tri of tris) {
            const A = tri[0];
            const B = tri[1];
            const C = tri[2];

            if (!A || !B || !C) {
                console.warn("Triángulo con índice inválido:", tri);
                continue;
            }

            const va = subtract(A, origin);
            const vb = subtract(B, origin);
            const vc = subtract(C, origin);

            const vol = dot(va, cross(vb, vc)) / 6;
            if (vol === 0) continue;

            totalVolume += vol;

            const localCentroid = scale(add(origin, scale(add(add(A, B), C), 1/4)), 1); // (origin + (A+B+C)/4)

            centroidSum = add(centroidSum, scale(localCentroid, vol));
        }
    }
    obj['center']=scale(centroidSum, 1 / totalVolume);
    obj['volume']=totalVolume;
    return scale(centroidSum, 1 / totalVolume);
}
let ds=1;
setInterval(()=>{
    ctx.clearRect(0,0,100000,100000)
    rotateInAxis(figura3D, Math.PI / ds, [1, 0, 1]);
    renderObject(ctx, figura3D, renderEdges);
    renderObject(ctx, figura3D, renderVertices);

    ds++
},1);

