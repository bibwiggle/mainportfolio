"""Export a smaller geometry-only lamp GLB from the source Blender scene."""

from pathlib import Path
import bpy

scene = bpy.context.scene
scene.frame_set(scene.frame_start)

for obj in scene.objects:
    if obj.type == "MESH" and not obj.hide_render and obj.name != "Cylinder.008":
        modifier = obj.modifiers.new("Compact web geometry", "DECIMATE")
        modifier.ratio = 0.20

output = Path(__file__).resolve().parent.parent / "public" / "models" / "pf-lamp-geometry-compact.glb"
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
print(f"CODEX_COMPACT_GLTF_EXPORT {result} {output} {output.stat().st_size} bytes")
