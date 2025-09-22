import type { ColorInstance, ColorLike } from 'color'
import Color from 'color'
import type { ColorFormat } from './utils'
import {
    computeDarkSaturation,
    computeDarkValue,
    computeHue,
    computeLightSaturation,
    computeLightValue,
    getColorString,
    toHSV
} from './utils'

/**
 * 基于 originColor 生成明/暗梯度色板中的一个颜色。
 *
 * 设计思想与原始函数保持一致：index 以 6 为基准（6 表示基色本身），index < 6 是更亮的色，
 * index > 6 是更暗的色。函数内部对 stepIndex 做了明确计算，避免把原始 index 直接用于步数。
 *
 * @param originColor 基础颜色（ColorLike）
 * @param index 索引，默认 6（代表基色）。通常取值范围 1..10（但函数并不强制）
 * @param format 输出格式 'hex'|'rgb'|'hsl'（默认 'hex'）
 * @returns 指定格式的颜色字符串
 */
export const colorPalette = (
    originColor: ColorLike,
    index = 6,
    format: ColorFormat = 'hex'
) => {
    const { h: baseH, s: baseS, v: baseV } = toHSV(originColor)

    // index = 6 表示原色
    if (index === 6) {
        return getColorString(Color(originColor) as ColorInstance, format)
    }

    // stepIndex 表示与基色的“距离”，用于乘以每步的增量
    const isLight = index < 6
    const stepIndex = isLight ? 6 - index : index - 6

    // 常量（与原实现保持一致）
    const hueStep = 2
    const minSaturationStep = 9
    const maxValue = 100
    const minValue = 30

    const newH = computeHue(baseH, isLight, stepIndex, hueStep)
    const newS = isLight
        ? computeLightSaturation(baseS, stepIndex, minSaturationStep)
        : computeDarkSaturation(baseS, stepIndex)
    const newV = isLight
        ? computeLightValue(baseV, stepIndex, maxValue)
        : computeDarkValue(baseV, stepIndex, minValue)

    const ret = Color({ h: newH, s: newS, v: newV })
    return getColorString(ret as ColorInstance, format)
}
