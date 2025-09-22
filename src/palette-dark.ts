import type { ColorInstance, ColorLike } from 'color'
import Color from 'color'
import { colorPalette } from './palette'
import type { ColorFormat } from './utils'
import { clamp, getColorString } from './utils'

/**
 * 暗色梯度算法（对应原始 colorPaletteDark）。
 *
 * 说明：
 * - 为了保留原实现意图（原代码里会基于 index 反向计算“亮色参考”并基于一个 mid-saturation 做上下步长分配），
 *   我在这里保留了相似的算法流程，但将中间计算拆解成可读的步骤：先计算 midSaturation（index===6 对应的基准饱和度），
 *   再根据 baseSaturation 计算上下 step 并返回最终颜色。
 *
 * @param originColor 基础颜色
 * @param index 索引（默认 6），与 colorPalette 的 index 含义保持一致（6 为基色）
 * @param format 输出格式
 */
export const colorPaletteDark = (
    originColor: ColorLike,
    index = 6,
    format: ColorFormat = 'hex'
) => {
    // 保底：把 index 限定到合理值（算法对 1..10 范围较友好）
    const idx = Math.round(index)

    // lightReferenceIndex 对应原代码的 (10 - index + 1) => 11 - index
    // 用它来获取一个“亮色参考”，然后以该参考的 hue/value 作为最终暗色色相与明度的基础。
    const lightRefIndex = clamp(11 - idx, 1, 10)
    const lightColor = Color(colorPalette(originColor, lightRefIndex, 'hex'))

    const origin = Color(originColor)
    const originHue = origin.hue()
    const originSat = origin.saturationv()
    const originV = origin.value()

    // 计算 index === 6 时的 midSaturation（与原实现逻辑一致：根据 hue 不同减少 15 或 20）
    function computeMidSaturationForIndexSix(hue: number, sat: number) {
        if (hue >= 50 && hue < 191) {
            return sat - 20
        }
        // 两侧（0-49, 191-360）使用 -15
        return sat - 15
    }

    const midSatRaw = computeMidSaturationForIndexSix(originHue, originSat)
    // midSat 需要裁剪到合法范围
    const midSat = clamp(midSatRaw, 0, 100)

    // baseSaturation 通过把 midSat 应用到一个 Color 对象上并读取其 saturationv() 得出（与原实现一致）
    const baseColor = Color({ h: originHue, s: midSat, v: originV })
    const baseSaturation = baseColor.saturationv()

    // 计算向上/向下的步长
    const stepDown = Math.ceil((baseSaturation - 9) / 4) // 用于 index > 6 的每步减少量（向暗）
    const stepUp = Math.ceil((100 - baseSaturation) / 5) // 用于 index < 6 的每步增加量（向亮）

    // 根据 index 返回饱和度
    function getSaturationByIndex(_index: number) {
        if (_index < 6) {
            // 更亮：基于 baseSaturation 向上增加
            return clamp(baseSaturation + (6 - _index) * stepUp, 0, 100)
        }
        if (_index === 6) {
            // 中间值（使用 origin 层面的调整值）
            return clamp(midSat, 0, 100)
        }
        // 更暗：基于 baseSaturation 向下减少
        return clamp(baseSaturation - stepDown * (_index - 6), 0, 100)
    }

    // 最终颜色使用 lightColor 的 hue 与 value (保持明度与色相) + 我们计算得到的饱和度
    const finalS = getSaturationByIndex(idx)
    const retColor = Color({
        h: lightColor.hue(),
        s: finalS,
        v: lightColor.value()
    })

    return getColorString(retColor as ColorInstance, format)
}
