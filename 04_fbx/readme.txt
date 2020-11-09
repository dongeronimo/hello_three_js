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
8) Primeiro precisamos de um arquivo para abrir. Baixei o capoeira.fbx do www.mixamo.com e pus na pasta assets do 04_fbx.

9) Crio um loader e uso a função load dele. A carga é asincrona e o resultado vem em um dos callbacks. O primeiro parâmetro
do callback é o arquivo a ser carregado, o 2o parametro é o callback do final da carga e esse callback recebe o objeto carregado,
o 3o parâmetro é o progresso da carga e recebe um objeto de progresso e o 4o parâmetro é o callback de erro e recebe um objeto de
erro.

10) Para adicionar o objeto à cena no final da carga basta usar o scene.add como usamos na lição anterior para criarmos multiplos 
cubos.

11) Na situação atual o objeto estará preto. Os elementos dele nos foram fornecidos com materiais que exigem que a cena tenha luzes e
o objeto também está na chamada T-Pose pois é um boneco cuja animação não está sendo executada. Se fosse por exemplo uma sala de uma app
de arquitetura não teria esse problema, é uma questão específica do boneco que eu usei. Então para enxergarmos o objeto precisamos criar
luzes.

-----------ILUMINAÇÂO-----------------------
12) A equação fundamental da renderização é a modelagem matemática do processo de renderização. Ela é um somatório de efeitos de cada
fonte de luz, do espaço entre a fonte de luz e as superficies, dos efeitos de reflexão, refração, absorção e emissão das superficies, 
dos efeitos no espaço entre a superficie que reflete a luz e o observador e dos efeitos no observador. Até o momento não foi preciso 
nos preocuparmos com estes conceitos mas agora, como precisamos de iluminação, precisamos nos preocupar.

13) O material do boneco exige luz, como há zero luzes na cena ele retorna todos os seus fragmentos (=pixels na tela nesta situação) como
pretos. A iluminação costuma ser modelada nos materiais como algoritimos que modelam a reflexão e absorção da luz na superficie do modelo 
para então determinar a cor a ser gerada. Então vamos criar a luz.

14) Vou criar o HemisphereLight. É uma fonte de luz bem simples, diretamente acima da cena, com a cor indo da cor do céu (1o parametro do 
construtor) para a cor do chão (2o parâmetro). Ela não serve para gerar sombras por limitações dela ser simples.
                const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
		hemiLight.position.set( 0, 200, 0 );
		scene.add( hemiLight );

