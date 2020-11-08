1) Criei o diretório do 04_fbx com um subdiretório js e index.html.
---------TRAZENDO TODA A THREEJS COMO MÓDULO PARA LIDAR COM AS DEPENDÊNCIAS--------
2) Baixei o repositório da threejs.

3) Copiei three.js\build\three.module.js para o diretório 04_fbx\build.

4) Copiei \three.js\examples\js para 04_fbx, pondo seu conteudo no diretório de js . O importador de FBX tem muitas
dependências de modulos auxiliares como o zip e o de NURBS.

5) Copiei C:\programacao\threejs\three.js\examples\jsm para 04_fbx, tendo agora um diretório jsm EM 04_fbx

6) Passei a usar o Web Server for Chrome para ser o servidor web. Isso é necessário porque vou usar
módulos e tem que ter um servidor para prover os módulos com o mime type correto e para evitar problemas
de CORS caso se abra o .html diretamente no explorador de arquivos.

7) Faço um teste para ver se todos os módulos estão sendo importados corretamente:
<html>
    <head title="Carregando FBX"></head>
    <body>
        <div id="c" style="height:500px"></div>
    </body>
    <script type="module">
        //NOVO: Importando a three como módulo.
        import * as THREE from "./build/three.module.js";
        import {OrbitControls} from "./jsm/controls/OrbitControls.js"
        import { FBXLoader } from './jsm/loaders/FBXLoader.js';
        function createRendererCameraScene(canvas){
            const renderer = new THREE.WebGLRenderer();
            const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth/canvas.clientHeight, 0.1, 1000);
            const scene = new THREE.Scene();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            canvas.appendChild(renderer.domElement);
            return {renderer, camera, scene};
        }
        function main() {
            const canvas = document.querySelector('#c');
            const {renderer, camera, scene} = createRendererCameraScene(canvas);
            function animate(){
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }
            animate();
        }
        main();
    </script>
</html>
Se tudo deu certo vai mostrar a tela preta e se conferir no debugger todos os objetos estarão inicializados.

------------CARGA DO FBX---------------------
8)