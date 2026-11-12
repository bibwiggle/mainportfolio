# Glass refraction starter for TouchDesigner

This is a starting adaptation of the website's glass refraction for a 3D
object in a GLSL MAT. It samples a separate background TOP, offsets the red,
green and blue channels separately, and adds the website's procedural chrome
bands. It is not an exact reproduction of the website: the moving light,
post-process bloom, and extra depth-peel pass for refraction between parts of
the same model are not included. It has not been tested in TouchDesigner.

## Setup

1. Create a background TOP, such as a Movie File In TOP or a Ramp TOP. A
   detailed, colorful image makes the refraction easier to see. For a 3D
   background, use a separate Render TOP containing the background geometry
   but not the glass geometry.
2. Create a Geometry COMP containing a sphere or your own model, a Camera COMP,
   and a Render TOP. Point the Render TOP's Camera and Geometry parameters to
   the camera and geometry. Make sure the model has normals.
3. Drag `glass.vert` and `glass.frag` into the TouchDesigner network as Text
   DATs. Create a GLSL MAT. On its Load page, set **Vertex Shader** to the
   `glass.vert` DAT and **Pixel Shader** to the `glass.frag` DAT. Do not add a
   `#version` line; TouchDesigner supplies it.
4. Press **Load Uniform Names** on the MAT. On its Samplers page, set the
   sampler named `uScene` to the background TOP. Apply the GLSL MAT to the
   Geometry COMP's Material parameter.
5. Set the Render TOP to the same resolution and aspect ratio as the background
   TOP. Set the Render TOP and Camera COMP background alpha to zero so only the
   rendered object is opaque.
6. Create a Composite TOP set to **Over**. Connect the Render TOP to input 1
   (foreground) and the background TOP to input 2. The object should sample
   and bend the background, while the rest of the background remains visible.
   Do not use this final composite or Render TOP as `uScene`, which would make
   a feedback loop.
7. Optionally add a Bloom TOP after the Composite TOP for glow.

Edit `IOR`, `REFRACTION_AMOUNT`, `DISPERSION`, and `REFRACTION_MIX` near the top
of `glass.frag` to change the look. If the sampled background is upside down,
uncomment the `uv.y` line in the pixel shader. If the MAT shows an error,
middle-click it or attach an Info DAT to see the compiler message.
