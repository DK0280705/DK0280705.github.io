---
title: "The Memes"
subtitle: "2022 Memes centered minigames"
image: "@/assets/the-memes-preview.png"
tags: ["Game", "Memes", "Godot"]
---

This is the second game i take part in KoloidStudios.
Mainly aimed to win a game jam competition held by ITB (Bandung Institute of Technology).
The theme of the game jam was 2022 local memes,
so we started to collect ideas and popular memes in Indonesia.

The result is a scrolling 2D game, that is centered in minigames. 
There are 3 minigames: bullet hell, Stardew Valley-like fishing mechanic, and precision time clicking game.

Unlike before, the character is made using `Skeleton2D`, so instead of creating animation frame by frame,
we animate using bones.

## Technical Implementation

- **Class hierarchy:** `Base_map` for overworld scenes (`outdoor`, `morioh`, `event_anjimeh`), `Base_minigame` for all three minigames, and `Base_mob` for player and enemies. Each provides shared shake effects, pause menu, dialog integration, and camera logic.

- **Player controller (`player.gd`):** Custom physics with acceleration-based movement, `lerp` deceleration, `Skeleton2D` bone animation, variable footstep SFX with random pitch, and a pause flag for cutscenes.

- **Bullet Hell (`bullet_hell.gd`):** Pattern enum (`P1`, `P2`, `P3`) with rotating spawners driving sine-wave bullet spawns. Player gets 3 lives (`trial` variable); on death, all projectiles are freed, a death cooldown timer runs, and the next life repositions the player via `Tween`. Each pattern has its own rotation speed, spawn-point count, and radius constants.

- **Latto-latto (`latto_latto.gd`):** A rhythm/precision-clicking game. A sine-wave drives the indicator position; difficulty ramps by shrinking the accuracy window at progress thresholds (20, 50, 60, 80). Accept presses must land within the accuracy bar and are gated by a `_pressed` flag to prevent spam. Score persists in `Global.latto_latto_score`.

- **Making "Blue Crystal" (`making_meth.gd`):** Precision-overlap minigame. A sine wave bounces a crystal indicator, and the player holds `ui_accept` to move a purity bar upward. Overlap detection uses `rect_position` + `rect_size` comparison. Progress increases when overlapping, decreases otherwise. 3 trials; score stored in `Global.making_meth_score`.

- **Dialog system:** Custom `EXP-System-Dialog` addon — a visual node-graph editor (story/dialog editors) that bakes into `.tres` resource files. The runtime `dialog_player.gd` parses tagged text (`<speaker>`, `<choiceJSON>`, `<image>`, `<variable>`), injects variables from a registry, and renders character portraits dynamically.

- **Save system:** 3-slot file-based saves using Godot's `File` class (`user://save1`–`save3`). `Save_system` stores the last checkpoint scene path; `Global.goto_scene()` handles scene transitions with optional spawn position and flip.

Here is the preview of the game:
<iframe width="560" height="315" src="https://www.youtube.com/embed/gWwKPxuc2t4?si=nXi39s1hPw-lo-6T" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>