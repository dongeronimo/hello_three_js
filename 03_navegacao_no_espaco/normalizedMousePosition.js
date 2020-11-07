function mousePositionAsNormalizedCoordinates(event, renderer){
    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    const pos = {
        x: (event.clientX - rect.left) * canvas.width  / rect.width,
        y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
    const pickPosition = new THREE.Vector2(0,0);
    pickPosition.x = (event.x / canvas.width ) *  2 - 1;
    pickPosition.y = (event.y / canvas.height) * -2 + 1;  // note we flip Y
    return pickPosition;
}