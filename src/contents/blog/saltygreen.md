[source code](https://github.com/KoloidStudios/salty-green)

This is the third game our team planned to make,
i was motivated enough to work in it, created the game loop and ideas,
but as our game designer said, due to not enough selling points,
we choose to not continue this project.

Still, there are some interesting technical points that i made during the development process. 
Whether is it efficient or not, it is still fun enough to implement actual physics in the game.
Also at the time i was developing this, LLM or generative AI are not smart enough to answer my problems.
Thus making this project a pride for my hardwork at figuring out things.

For example:

#### Simplified marine hydrodynamics

I wanted the ships to feel heavy and boat-like in the water, so I built a simplified physics model on top of Godot's `RigidBody2D`, using real-world SI units (meters, kilograms, newtons) and converting to/from pixel space via a scale of 16 pixels per meter.

**Thrust** is calculated using momentum theory, the same principle used for helicopter rotors and marine propellers. The formula relating power to thrust is:

$$
T = \left(\frac{\pi}{2} \cdot \rho \cdot D_p^2 \cdot P^2\right)^{1/3}
$$

Where $\rho = 1000$ kg/m³ (water density), $D_p$ is propeller diameter, and $P$ is engine power in watts. This is rearranged from the classic momentum-theory relation $P = \dfrac{T^{3/2}}{\sqrt{2\rho A}}$, first formalized by Rankine (1865) and Froude (1889). Reverse thrust is scaled to 40% of forward thrust.

**Drag** uses the standard quadratic fluid drag equation $F_d = \frac{1}{2}\rho v^2 C_d A$, with $C_d = 0.7$ and projected area $A = \text{width} \times \text{length}$. Instead of applying drag as a force each frame, I converted it into a velocity-dependent damping coefficient and set it on Godot's `linear_damp`, letting the engine handle it stably.

**Rotational inertia** approximates the ship as a solid cylinder rotating about its vertical axis (the game is top-down):

$$
I = \left(\frac{1}{4}W^2 + \frac{1}{12}L^2\right) \cdot M
$$

The overall result isn't a perfect simulation — no wave resistance, no added-mass effects, no hull-shape nuance, but it makes ships feel realistic enough to the actual vessel on water, which was enough for a game.

*Sources: [Momentum theory, Wikipedia](https://en.wikipedia.org/wiki/Momentum_theory), [Propeller Thrust (Simple Momentum Theory)](https://www.grc.nasa.gov/www/k-12/airplane/propth.html)*
*

![Salty Green preview](@/assets/salty-green-preview-video.webp)