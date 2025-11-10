<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import {
    AmbientLight,
    CanvasTexture,
    Clock,
    Color,
    DirectionalLight,
    Mesh,
    MeshStandardMaterial,
    NearestFilter,
    NearestMipmapNearestFilter,
    PerspectiveCamera,
    RepeatWrapping,
    Scene,
    Texture,
    TorusGeometry,
    Uniform,
    WebGLRenderer,
} from 'three';
import { Effect, EffectComposer, EffectPass, RenderPass } from 'postprocessing';

const fragment = `
uniform sampler2D uCharacters;
uniform float uCharactersCount;
uniform float uCellSize;
uniform bool uInvert;
uniform vec3 uColor;
uniform float uTime;

const vec2 SIZE = vec2(16.);
const mat2 NOISE_ROT = mat2(0.8, 0.6, -0.6, 0.8);

vec3 greyscale(vec3 color, float strength) {
    float g = dot(color, vec3(0.299, 0.587, 0.114));
    return mix(color, vec3(g), strength);
}

vec3 greyscale(vec3 color) {
    return greyscale(color, 1.0);
}

vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

// Add modern colorful gradient function with gentle movement returns vec3
vec3 gradientEffect(vec2 uv, float time) {
    vec2 centered = uv - 0.5;
    vec2 rotated = NOISE_ROT * centered;
    vec2 animated = rotated + vec2(time * 0.02, -time * 0.015);

    float linear = clamp(animated.x * 0.75 + 0.5, 0.0, 1.0);
    float wave = 0.5 + 0.5 * sin((animated.y + time * 0.3) * 3.14159265);
    float mixFactor = smoothstep(0.0, 1.0, linear * 0.7 + wave * 0.3);

    vec3 colorA = hsv2rgb(vec3(fract(0.56 + time * 0.03), 0.5, 0.85));
    vec3 colorB = hsv2rgb(vec3(fract(0.82 + time * 0.05), 0.7, 0.95));
    vec3 blended = mix(colorA, colorB, mixFactor);

    float edgeFade = smoothstep(1.0, 0.35, length(centered));
    return blended * edgeFade;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 cell = resolution / uCellSize;
    vec2 grid = 1.0 / cell;
    vec2 pixelizedUV = grid * (0.5 + floor(uv / grid));
    vec4 pixelized = texture2D(inputBuffer, pixelizedUV);
    float greyscaled = greyscale(pixelized.rgb).r;

    if (uInvert) {
        greyscaled = 1.0 - greyscaled;
    }

    float characterIndex = floor((uCharactersCount - 1.0) * greyscaled);
    vec2 characterPosition = vec2(mod(characterIndex, SIZE.x), floor(characterIndex / SIZE.y));
    vec2 offset = vec2(characterPosition.x, -characterPosition.y) / SIZE;
    vec2 charUV = mod(uv * (cell / SIZE), 1.0 / SIZE) - vec2(0., 1.0 / SIZE) + offset;
    vec4 asciiCharacter = texture2D(uCharacters, charUV);

    float characterProgress = (characterIndex + 1.0) / uCharactersCount;
    float hue = fract(uTime * 0.1 + pixelizedUV.x * 0.35 + pixelizedUV.y * 0.45 + characterProgress * 0.1);
    vec3 rainbow = hsv2rgb(vec3(hue, 0.9, 1.0));
    vec3 tinted = mix(uColor, rainbow, 0.8);
    asciiCharacter.rgb = tinted * asciiCharacter.r * characterProgress * 0.4;
    asciiCharacter.rgb += gradientEffect(pixelizedUV, uTime) * characterProgress * 0.05;
    asciiCharacter.rgb = clamp(asciiCharacter.rgb, 0.0, 1.0);
    asciiCharacter.a = pixelized.a;
    outputColor = asciiCharacter;
}
`;

interface IASCIIEffectProps {
    characters?: string;
    fontSize?: number;
    cellSize?: number;
    color?: string;
    invert?: boolean;
}

class ASCIIEffect extends Effect {
    constructor({
        characters = ` .:,'-^=*+?!|0#X%WM@`,
        fontSize = 54,
        cellSize = 16,
        color = '#ffffff',
        invert = false
    }: IASCIIEffectProps = {}) {
        const uniforms = new Map<string, Uniform>([
            ['uCharacters', new Uniform(new Texture())],
            ['uCellSize', new Uniform(cellSize)],
            ['uCharactersCount', new Uniform(characters.length)],
            ['uColor', new Uniform(new Color(color))],
            ['uInvert', new Uniform(invert)],
            ['uTime', new Uniform(0)]
        ]);

        super('ASCIIEffect', fragment, { uniforms });

        const charactersTextureUniform = this.uniforms.get('uCharacters');

        if (charactersTextureUniform) {
            charactersTextureUniform.value = this.createCharactersTexture(characters, fontSize);
        }
    }

    /** Draws the characters on a Canvas and returns a texture */
    public createCharactersTexture(characters: string, fontSize: number): Texture {
        const canvas = document.createElement('canvas');

        const SIZE = 1024;
        const MAX_PER_ROW = 16;
        const CELL = SIZE / MAX_PER_ROW;

        canvas.width = canvas.height = SIZE;

        const texture = new CanvasTexture(
            canvas,
            undefined,
            RepeatWrapping,
            RepeatWrapping,
            NearestFilter,
            NearestMipmapNearestFilter
        );

        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Context not available');
        }

        context.clearRect(0, 0, SIZE, SIZE);
        context.font = `${fontSize}px Source Code Pro, consolas, monospace`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#fff';

        for (let i = 0; i < characters.length; i++) {
            const char = characters[i];
            const x = i % MAX_PER_ROW;
            const y = Math.floor(i / MAX_PER_ROW);

            context.fillText(char as string, x * CELL + CELL / 2, y * CELL + CELL / 2);
        }

        texture.needsUpdate = true;

        return texture;
    }
}
const containerRef = ref<HTMLDivElement | null>(null);

let renderer: WebGLRenderer | undefined;
let composer: EffectComposer | undefined;
let camera: PerspectiveCamera | undefined;
let scene: Scene | undefined;
let donut: Mesh | undefined;
let asciiEffect: ASCIIEffect | undefined;
let animationId: number | undefined;
let isInitialized = false;

const clock = new Clock();

const disposeDonut = () => {
    if (!donut) return;

    scene?.remove(donut);
    donut.geometry.dispose();

    if (Array.isArray(donut.material)) {
        donut.material.forEach((material) => material.dispose());
    } else {
        donut.material.dispose();
    }

    donut = undefined;
};

const disposeComposerResources = () => {
    if (!asciiEffect) return;

    const charactersTex = asciiEffect.uniforms.get('uCharacters')?.value;
    if (charactersTex instanceof Texture) {
        charactersTex.dispose();
    }

    asciiEffect.dispose();
    asciiEffect = undefined;
};

const updateRendererSize = () => {
    if (!renderer || !composer || !camera) return;

    const container = containerRef.value;
    if (!container) return;

    const width = container.clientWidth;
    const height = Math.max(container.clientHeight, 1);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    composer.setSize(width, height);
};

const renderFrame = () => {
    animationId = requestAnimationFrame(renderFrame);
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    if (asciiEffect) {
        const timeUniform = asciiEffect.uniforms.get('uTime');
        if (timeUniform) {
            timeUniform.value = elapsed;
        }
    }

    if (donut) {
        donut.rotation.x += delta * 0.6;
        donut.rotation.y += delta * 1.0;
    }

    composer?.render(delta);
};

const initScene = () => {
    const container = containerRef.value;
    if (!container) return false;

    scene = new Scene();

    camera = new PerspectiveCamera(35, container.clientWidth / Math.max(container.clientHeight, 1), 0.1, 100);
    camera.position.set(0, 0, 6);

    renderer = new WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: false });
    if (!renderer) return false;
    renderer.setClearColor(0x000000, 1);
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    asciiEffect = new ASCIIEffect({
        characters: '.,-~:;=!*#',
        fontSize: 48,
        cellSize: 32,
        color: '#f4f4f4',
    });

    const asciiPass = new EffectPass(camera, asciiEffect);
    composer.addPass(asciiPass);

    const torusGeometry = new TorusGeometry(2.5, 1.2, 64, 256);
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
    renderFrame();

    return true;
};

const handleResize = () => {
    updateRendererSize();
};

onMounted(() => {
    isInitialized = initScene();
    if (isInitialized) {
        window.addEventListener('resize', handleResize);
    }
});

onBeforeUnmount(() => {
    if (isInitialized) {
        window.removeEventListener('resize', handleResize);
    }

    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = undefined;
    }

    disposeDonut();
    disposeComposerResources();

    composer?.dispose();
    composer = undefined;

    renderer?.dispose();
    renderer?.domElement.remove();
    renderer = undefined;

    scene = undefined;
    camera = undefined;
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
    pointer-events: none;
    overflow: hidden;
    background: transparent;
    opacity: 0.8;
}

.ascii-background :deep(canvas) {
    width: 100% !important;
    height: 100% !important;
    display: block;
    pointer-events: none;
}
</style>
