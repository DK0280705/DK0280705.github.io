import {
    CanvasTexture,
    NearestFilter,
    NearestMipmapNearestFilter,
    RepeatWrapping,
    Texture,
    Uniform,
} from 'three';
import { Effect } from 'postprocessing';

const fragment = `
uniform sampler2D uCharacters;
uniform float uCharactersCount;
uniform float uCellSize;
uniform float uTime;

const vec2 SIZE = vec2(16.);
const mat2 NOISE_ROT = mat2(0.8, 0.6, -0.6, 0.8);

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
    float greyscaled = dot(pixelized.rgb, vec3(0.299, 0.587, 0.114));
    float characterIndex = floor((uCharactersCount - 1.0) * greyscaled);
    vec2 characterPosition = vec2(mod(characterIndex, SIZE.x), floor(characterIndex / SIZE.y));
    vec2 offset = vec2(characterPosition.x, -characterPosition.y) / SIZE;
    vec2 cellPerSize = cell / SIZE;
    vec2 charUV = mod(uv * cellPerSize, vec2(1.0) / SIZE) - vec2(0., 1.0 / SIZE) + offset;
    vec4 asciiCharacter = texture2D(uCharacters, charUV);

    float characterProgress = (characterIndex + 1.0) / uCharactersCount;
    float hue = fract(uTime * 0.1 + pixelizedUV.x * 0.35 + pixelizedUV.y * 0.45 + characterProgress * 0.1);
    vec3 rainbow = hsv2rgb(vec3(hue, 0.9, 1.0));
    asciiCharacter.rgb = characterProgress * (rainbow * asciiCharacter.r * 0.4 + gradientEffect(pixelizedUV, uTime) * 0.05);
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

export class ASCIIEffect extends Effect {
    constructor({
        characters = ` .:,'-^=*+?!|0#X%WM@`,
        fontSize = 54,
        cellSize = 16,
    }: IASCIIEffectProps = {}) {
        const uniforms = new Map<string, Uniform>([
            ['uCharacters', new Uniform(new Texture())],
            ['uCellSize', new Uniform(cellSize)],
            ['uCharactersCount', new Uniform(characters.length)],
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