import _img0 from "@/assets/bleprotocol-preview1.png";
import _img1 from "@/assets/oiia-cat.gif";
import _img2 from "@/assets/esp32.jpg";
import _img3 from "@/assets/mir-preview.png";
import _img4 from "@/assets/salty-green-preview.png";
import _img5 from "@/assets/the-memes-preview.png";
import _img6 from "@/assets/obf-preview.png";

import type { ContentCard } from "@/composables/useContentCards";

export const ALL_CARDS: ContentCard[] = [
  { title: "Transport Notification Protocol", subtitle: "A custom protocol for real-time transport notifications using BLE", image: _img0, tags: ["Embedded","Rust","IoT","BLE"], markdownFile: "blog/bleprotocol.md" },
  { title: "Hello World", subtitle: "It works", image: _img1, tags: ["Vue","Graphics","Website"], markdownFile: "blog/helloworld.md" },
  { title: "Hue Controller", subtitle: "Controlling Philips Hue lights with esp32 and Rust", image: _img2, tags: ["Embedded","Rust","IoT"], markdownFile: "blog/huecontroller.md" },
  { title: "May I Return", subtitle: "First metroidvania game", image: _img3, tags: ["Game","Metroidvania","Godot"], markdownFile: "blog/mayireturn.md" },
  { title: "Salty Green", subtitle: "Ship battle game", image: _img4, tags: ["Game","Physics","Godot"], markdownFile: "blog/saltygreen.md" },
  { title: "The Memes", subtitle: "2022 Memes centered minigames", image: _img5, tags: ["Game","Memes","Godot"], markdownFile: "blog/thememes.md" },
  { title: "May I Comeback", subtitle: "A RTS game", image: _img1, tags: ["Game","Design"], markdownFile: "project/mayicomeback.md" },
  { title: "May I Return", subtitle: "First metroidvania game", image: _img3, tags: ["Game","Design"], markdownFile: "project/mayireturn.md" },
  { title: "May I Return: Reborn", subtitle: "May I Return remake", image: _img1, tags: ["Game","Design"], markdownFile: "project/mir-reborn.md" },
  { title: "Obfuscation Experiment", subtitle: "Evaluating LLM effectiveness on obfuscated code", image: _img6, tags: ["Research","LLM"], markdownFile: "project/obfuscation-experiment.md" }
];
