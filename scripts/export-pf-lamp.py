"""Export the visible lamp geometry and motion without Blender materials."""

from pathlib import Path
import bpy

scene = bpy.context.scene
scene.frame_set(scene.frame_start)
output_dir = Path(__file__).resolve().parent.parent / "public" / "models"
output_dir.mkdir(parents=True, exist_ok=True)

def export(name):
    output = output_dir / name
    result = bpy.ops.export_scene.gltf(
        filepath=str(output),
        export_format="GLB",
        export_materials="NONE",
        export_gn_mesh=True,
        export_apply=True,
        use_renderable=True,
        export_cameras=True,
        export_lights=False,
        export_animations=True,
        export_animation_mode="SCENE",
        export_frame_range=True,
        export_frame_step=1,
        export_force_sampling=True,
        export_optimize_animation_size=True,
    )
    print(f"CODEX_GLTF_EXPORT {result} {output} {output.stat().st_size} bytes")

export("pf-lamp-geometry.glb")

for obj in scene.objects:
    if obj.type == "MESH" and not obj.hide_render and obj.name != "Cylinder.008":
        reduction = obj.modifiers.new("Web geometry reduction", "DECIMATE")
        reduction.ratio = 0.35

export("pf-lamp-geometry-lite.glb")
