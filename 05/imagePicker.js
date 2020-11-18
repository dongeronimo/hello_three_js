/*
Implementação do processo de picking. Chamo de image picker porque ele troca os materiais por
materiais que codificam o id de cada objeto como uma cor, renderizo para uma textura 1x1 e vejo
qual cor eu peguei. Com o valor da cor eu descubro o objeto escolhido.

Esse picker funciona para o caso de objetos estáticos, objetos animados e skinned meshes (bonecos).
Não funciona para o caso de objetos com texturas com transparência porque a transparência é descartada
no processo de picking ao trocar o material do objeto por um MeshBasicMaterial, então a transparência é
ignorada.

Como usar:
1) Criar uma nova instância de ImagePicker. 
2) Passar o renderer, a camera, a cena e a posição onde fazer o picking. A posição tem que estar no sistema
de coordenadas do componente (eu uso offsetX, offsetY do objeto de eventos)
ex:
function onMouseMove(e){
    const x = e.offsetX;
    const y = e.offsetY;
    const obj = new ImagePicker(THREE).pick(renderer, camera, scene, x, y);
}
*/
class ImagePicker{
    constructor(THREE){
        this.THREE = THREE;
        this.pickingTexture = new THREE.WebGLRenderTarget(500,500);
    }
    /**
     * Percorre a árvore de objetos, a partir de obj, atribuindo a cada objeto que tenha material
     * o MeshBasicMaterial com a cor igual ao id do objeto atual. O método é recursivo e percorre
     * toda a arvore, depth-first. O material original é guardado no atributo oldMaterial do objeto.
     */ 
    changeMaterialToIdMaterial(obj){
        if(obj.PICKER_ID){
            const id = obj.PICKER_ID;
            const originalMaterial = obj.material;
            this.switchMaterial(obj, originalMaterial, id);
        }
        obj.children.forEach(child=>{
            this.changeMaterialToIdMaterial(child);
        });
    }
    /**
     * Cria o material com a cor = id e guarda o material original em oldMaterial;
     */
    switchMaterial(child, oldMaterial, id){
        child.oldMaterial = oldMaterial;
        var idMaterial = new this.THREE.MeshBasicMaterial( { color: id } );
        idMaterial.flatShading = true;
        idMaterial.fog = false;
        idMaterial.side = this.THREE.DoubleSide;
        if(oldMaterial.skinning === true){
            idMaterial.skinning = true;
        }
        child.material = idMaterial;
    }
    /**
     * Troca o material do objeto e de seus filhos de volta para o material original de 
     * antes do picking, desfazendo o que foi feito em changeMaterialToIdMaterial. 
     */
    switchMaterialToOriginalMaterial(obj){
        if(obj.PICKER_ID){
            obj.material = obj.oldMaterial;
        }
        obj.children.forEach(child=>{
            this.switchMaterialToOriginalMaterial(child);
        })
    }
    /*
    * Faz o picking. mouseX e mouseY são em coordenadas do elemento (eu uso offsetX e offsetY do evento),
    * retornando o objeto ou undefined.
    */
    pick(renderer, camera, scene, mouseX, mouseY, debugCanvas){
        this.changeMaterialToIdMaterial(scene);
        const width = renderer.domElement.offsetWidth;
        const height = renderer.domElement.offsetHeight;
        this.pickingTexture = new this.THREE.WebGLRenderTarget(width,height);
        renderer.setRenderTarget(this.pickingTexture);
        renderer.render(scene, camera);
        const pixelBuffer = new Uint8ClampedArray( width*height*4 );
        renderer.readRenderTargetPixels( this.pickingTexture, 0, 0, width, height, pixelBuffer );
        renderer.setRenderTarget(null);
        this.switchMaterialToOriginalMaterial(scene);
        const idR = pixelBuffer[(Math.floor(mouseX) + Math.floor(mouseY)*width) * 4];
        const idG = pixelBuffer[(Math.floor(mouseX) + Math.floor(mouseY)*width) * 4+1];
        const idB = pixelBuffer[(Math.floor(mouseX) + Math.floor(mouseY)*width) * 4+2];
        const id = ( idR << 16 ) | ( idG << 8 ) | ( idB );
        console.log("id = "+id)
        return id;

        // if(debugCanvas){
        //     var ctx = debugCanvas.getContext("2d");
        //     // var clampedBuffer = new Uint8ClampedArray(pixelBuffer)
        //     ctx.clearRect(0, 0, width, height);
        //     ctx.fill()
        //     var imageData = new ImageData(pixelBuffer, width, height)

        //     ctx.putImageData(imageData, 0,0);
        //     ctx.beginPath();
        //     ctx.arc(mouseX, mouseY, 2, 0, 2 * Math.PI);
        //     ctx.fillStyle = "red";
        //     ctx.fill()
        //     const idR = pixelBuffer[(Math.floor(mouseX) + Math.floor(mouseY)*width) * 4];
        //     const idG = pixelBuffer[(Math.floor(mouseX) + Math.floor(mouseY)*width) * 4+1];
        //     const idB = pixelBuffer[(Math.floor(mouseX) + Math.floor(mouseY)*width) * 4+2];
        //     const id = ( idR << 16 ) | ( idG << 8 ) | ( idB );
        //     console.log(id)
        // }else{
        //     const id = ( pixelBuffer[ 0 ] << 16 ) | ( pixelBuffer[ 1 ] << 8 ) | ( pixelBuffer[ 2 ] );
        //     console.log("id = ", id)
        // }

        
        // this.changeMaterialToIdMaterial(scene);
        // camera.setViewOffset(renderer.domElement.width,
        //     renderer.domElement.height, 
        //     mouseX * window.devicePixelRatio | 0,
        //     mouseY * window.devicePixelRatio | 0,
        //     1,1);
        // renderer.setRenderTarget(this.pickingTexture);
        // renderer.render(scene, camera);
        // const pixelBuffer = new Uint8Array( 4 );
        // renderer.readRenderTargetPixels( this.pickingTexture, 0, 0, 1, 1, pixelBuffer );
        // this.switchMaterialToOriginalMaterial(scene);
        // camera.clearViewOffset();
        // renderer.setRenderTarget(null);
        // const id = ( pixelBuffer[ 0 ] << 16 ) | ( pixelBuffer[ 1 ] << 8 ) | ( pixelBuffer[ 2 ] );
        // console.log("id = ", id)
        // const result = scene.getObjectById(id);
        // return result;
    }
}

class ObjectIdController{
    constructor(){
        this.counter = 0;
    }
    reapplyIds(scene){
        this.counter = 1;
        console.log("Reapplying IDs")
        const f=(obj)=>{
            if(obj.material && obj.visible){
                obj.PICKER_ID = this.counter;
                console.log("(object, id)=",obj, obj.PICKER_ID);
                this.counter++;
            }
            obj.children.forEach(child=>f(child));
        }
        f(scene);
    }
    findByPickerId(obj, pickerId){
        //Se é esse retorna ele
        if(!!obj.PICKER_ID && obj.PICKER_ID === pickerId){
            return obj;
        }
        //Senão retorna o filho que for (se algum for)
        let found;
        for(let i=0; i<obj.children.length; i++){
            let result = this.findByPickerId(obj.children[i], pickerId);
            if(!!result){
                found = result;
                break;
            }
        }
        return found;
    }
    
}