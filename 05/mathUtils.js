function calculateNDC(event){
    //x & y 
   const x = event.offsetX;
   const y = event.offsetY;
   //largura e altura da região
   const w = event.target.offsetWidth;
   const h = event.target.offsetHeight;
   //2D coordinates of the mouse, in normalized device coordinates (NDC)---X and Y components should be between -1 and 1. (https://threejs.org/docs/#api/en/core/Raycaster.setFromCamera)
   //1)Normaliza
   const normalizedX = x/w;
   const normalizedY = y/h;
   //2)Transforma em NDC
   const ndcX = normalizedX * 2 - 1;
   const ndcY = normalizedY * -2 + 1;
   return new THREE.Vector2(ndcX, ndcY);
}