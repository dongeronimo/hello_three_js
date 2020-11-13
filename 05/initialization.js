
function createRendererCameraAndScene(THREE, OrbitControls, element){
    const renderer = new THREE.WebGLRenderer();
    const camera = new THREE.PerspectiveCamera(75, 
        element.clientWidth/element.clientHeight, 1, 10000);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00ff00);
    renderer.setSize(element.clientWidth, element.clientHeight);
    element.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0,20, 100);
    controls.update();
    return {renderer, camera, scene, controls};
}

function createLight(THREE, scene){
    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 500, 200, 0 );
    scene.add( hemiLight );
}

