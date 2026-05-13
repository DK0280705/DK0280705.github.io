<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import {
    AmbientLight,
    Clock,
    DirectionalLight,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    Scene,
    TorusGeometry,
    Uniform,
    WebGLRenderer,
} from 'three';
import { EffectComposer, EffectPass, RenderPass } from 'postprocessing';
import { ASCIIEffect } from './ASCIIEffect';

const containerRef = ref<HTMLDivElement>();

let renderer: WebGLRenderer;
let composer: EffectComposer;
let camera: PerspectiveCamera;
let scene: Scene;
let donut: Mesh;
let animationId: number;

const clock = new Clock();
let timeUniform: Uniform<number>;

const updateRendererSize = () => {
    const container = containerRef.value!;

    const width = container.clientWidth;
    const height = Math.max(container.clientHeight, 1);

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    composer.setSize(width, height);
};

let lastFrameMs = 0;
const FRAME_INTERVAL = 1000 / 16;

const renderFrame = (timestamp: number) => {
    animationId = requestAnimationFrame(renderFrame);

    if (timestamp - lastFrameMs < FRAME_INTERVAL) return;
    lastFrameMs = timestamp;

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    timeUniform.value = elapsed;
    donut.rotation.x += delta * 0.6;
    donut.rotation.y += delta * 1.0;
    composer.render(delta);
};

const initScene = () => {
    const container = containerRef.value!;

    scene = new Scene();

    camera = new PerspectiveCamera(35, container.clientWidth / Math.max(container.clientHeight, 1), 0.1, 100);
    camera.position.set(0, 0, 6);

    renderer = new WebGLRenderer({alpha: true});
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const asciiEffect = new ASCIIEffect({
        characters: '.,-~:;=!*#',
        fontSize: 48,
        cellSize: 32,
        color: '#f4f4f4',
    });
    timeUniform = asciiEffect.uniforms.get('uTime') as Uniform<number>;

    const asciiPass = new EffectPass(camera, asciiEffect);
    composer.addPass(asciiPass);

    const torusGeometry = new TorusGeometry(2.5, 1.2, 8, 24);
    const torusMaterial = new MeshStandardMaterial({
        color: 0xfff1f1,
        metalness: 0.15,
        roughness: 0.35,
        emissive: 0x111111,
    });

    donut = new Mesh(torusGeometry, torusMaterial);
    scene.add(donut);

    const ambientLight = new AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const keyLight = new DirectionalLight(0xffffff, 1.25);
    keyLight.position.set(3.5, 4.5, 5.0);
    scene.add(keyLight);

    updateRendererSize();
    clock.start();
    renderFrame(0);
};

onMounted(() => {
    initScene();
    window.addEventListener('resize', updateRendererSize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateRendererSize);

    cancelAnimationFrame(animationId);

    scene.traverse((object) => {
        if (object instanceof Mesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
                object.material.forEach((material) => material.dispose());
            } else {
                object.material.dispose();
            }
        }
    });

    clock.stop();
    composer.dispose();
    renderer.dispose();
});

</script>

<template>
    <div ref="containerRef" class="ascii-background"></div>
</template>

<style scoped>
.ascii-background {
    position: absolute;
    inset: 0;
    z-index: 2;
    overflow: hidden;
    pointer-events: none;
    background: transparent;
    opacity: 0.8;
}

.ascii-background :deep(canvas) {
    width: 100% !important;
    height: 100% !important;
    pointer-events: none;
}
</style>
