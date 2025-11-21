class Object3D { // Aun no probada
    // faces es un array con los vertices de cada una de las caras, las coordenadas tambien se tratan como arrays de longitud 3.
    constructor(faces) {
        let processFaces = [];
        if (faces instanceof Face) {
            this.faces = faces || [];
        } else {
            faces.forEach(face => processFaces.push(new Face(face)))
            this.faces = processFaces
        }
        this.triangles = [] //Un array con arrays de los triangulos de cada cara, cada triangulo es un objeto, con las propiedades que despues se agregaran 
    }
    triangulate() {

    }
}
class Face {
    static epsilon = 0.0001;
    constructor(vertices) {
        this.epsilon = Face.epsilon;
        this.vertices = vertices;
        this.verticesInfo = {
            total: vertices.length
        }
        this.triangles = []
        this.counterClockwise();
        this.triangulate()
        console.log(this)
    }
    counterClockwise() { // (movi algo de esta funcion, porque se rompia al tener poligonos iregulares, paso de cross a cross3
        let area = 0
        for (let i = 0; i <= this.vertices.length - 2; i++) {
            let sig = i + 1
            let vertex = this.vertices[i]
            area += cross([vertex[0], this.vertices[sig][1]], [this.vertices[sig][0], vertex[1]]);
        }
        if (area < 0) {
            this.vertices = this.vertices.reverse()
        }
    }
    isConvexVertex(pointA, pointB, pointC) {//Toma tres puntos consecutivos:
        const vector1 = sub(pointB, pointA)
        const vector2 = sub(pointC, pointB)
        const resultCross = cross(vector1, vector2)
        if (resultCross > 0) {
            return resultCross
        }
    }
    PointInTriangle(triangle, polygon) {
        const [A, B, C] = triangle;
        for (let i = 0; i < polygon.length; i++) {
            const P = polygon[i];
            if (P === A || P === B || P === C) continue;
            const prev = polygon[(i - 1 + polygon.length) % polygon.length];
            const next = polygon[(i + 1) % polygon.length];
            if (this.isConvexVertex(prev, P, next) > 0) {
                continue;
            }
            const s1 = cross(sub(B, A), sub(P, A));
            const s2 = cross(sub(C, B), sub(P, B));
            const s3 = cross(sub(A, C), sub(P, C));
            if (s1 > 0 && s2 > 0 && s3 > 0) {
                return true;
            }
        }

        return false; // ningún punto concavo dentro → sí es una oreja
    }
    proceesTriangle(triangle) {
        const u = sub3(triangle[1], triangle[0]);
        const v = sub3(triangle[2], triangle[0]);
        const crossUV = cross3(u, v);
        const center = add3(add3(triangle[0], triangle[1]), triangle[2]).map(axis => axis / 3);

        return {//no calcule algunas cosas, porque creo que esas se calcualn mejor en triangulate()
            triangle_points: triangle,
            area: mod3(crossUV) / 2,
            normal: unit3(u, v),
            center: center,
            boundingSphere: [mod3(sub3(triangle[0], center)), mod3(sub3(triangle[1], center)), mod3(sub3(triangle[2], center))].map(c => Math.max(c)),
            p: Math.abs(dot3(triangle[0], triangle[1])) + Math.abs(dot3(triangle[1], triangle[2])) + Math.abs(dot3(triangle[2], triangle[0])),

        }
    }
    triangulate() {
        const polygon = [...this.vertices];
        let i = 0;
        while (polygon.length > 3) {
            //console.log('i-1: ', (i - 1 + polygon.length) % polygon.length,'i: ',i, 'i+1: ', (i + 1 + polygon.length) % polygon.length, )
            //console.log(`long: ${polygon.length} index: ${i}`)
            const V1 = polygon[(i - 1 + polygon.length) % polygon.length];
            const V2 = polygon[i];
            const V3 = polygon[(i + 1) % polygon.length];
            const triangle = [V1, V2, V3];
            //console.log(polygon)
            if (this.isConvexVertex(V1, V2, V3) > 0 && !this.PointInTriangle(triangle, polygon)) {
                const processed = this.proceesTriangle(triangle);
                if (processed.area >= this.epsilon) {
                    this.triangles.push(processed);
                }
                polygon.splice(i, 1);
                if (i >= polygon.length) {
                    i = 0;
                }
                continue;
            }
            i = (i + 1) % polygon.length;
        }
        this.triangles.push(this.proceesTriangle(polygon));
    }
}


const cubeFaces = new Object3D([
    // Frontal
    [
        [-10, -10, -10],
        [10, -10, -10],
        [10, 10, -10],
        [-10, 10, -10]
    ],
    // Trasera
    [
        [-10, -10, 10],
        [10, -10, 10],
        [10, 10, 10],
        [-10, 10, 10]
    ],
    // Derecha
    [
        [10, -10, -10],
        [10, -10, 10],
        [10, 10, 10],
        [10, 10, -10]
    ],
    // Izquierda
    [
        [-10, -10, -10],
        [-10, -10, 10],
        [-10, 10, 10],
        [-10, 10, -10]
    ],
    // Superior
    [
        [-10, 10, -10],
        [10, 10, -10],
        [10, 10, 10],
        [-10, 10, 10]
    ],
    // Inferior
    [
        [-10, -10, -10],
        [10, -10, -10],
        [10, -10, 10],
        [-10, -10, 10]
    ]
]);