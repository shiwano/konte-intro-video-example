import { asset, definePatch } from "konte";
import { imageQwenImageEdit21Inpaint } from "konte/workspace/adapters/comfy/image_qwen_image_edit_2_1_inpaint.js";

export default definePatch<"image">(({ source }) => {
  const patched = asset("noLamp", imageQwenImageEdit21Inpaint, {
    image1: source,
    left: 0,
    top: 0,
    right: 0.16,
    bottom: 0.2,
    prompt:
      "In <image1>, remove the round lavender desk-lamp base with its dark outline from the top-left corner; smooth white desktop in the same warm cream glow fills its place, continuous with the desk around it. Keep everything else unchanged.",
    negativePrompt: "desk lamp, lamp base, lamp shade, round object, dark outline",
  });
  const unlit = asset("noGlow", imageQwenImageEdit21Inpaint, {
    image1: patched,
    left: 0,
    top: 0,
    right: 1,
    bottom: 1,
    prompt:
      "In <image1>, the warm cream pool of lamplight on the left of the desktop is gone: the whole desktop is evenly lit plain soft white, a neutral off-white with only a faint grey-violet tint in the soft shadow under the page stack and the hand, quiet night light, with only the laptop's cool glow at the upper right. Keep everything else unchanged.",
    negativePrompt: "warm glow, cream light, bright spot, light pool, lamp, blue desk, lavender desk, blue tint",
  });
  return unlit;
});
