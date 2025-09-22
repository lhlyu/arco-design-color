import type { ColorInstance, ColorLike } from 'color'
import Color from 'color'

export type ColorFormat = 'hex' | 'rgb' | 'hsl'

/**
 * 将 ColorInstance 输出为字符串（hex/rgb/hsl）
 * @param color Color 实例
 * @param format 输出格式，默认 'hex'
 * @returns 格式化颜色字符串
 */
export const getColorString = (
    color: ColorInstance,
    format: ColorFormat = 'hex'
): string => {
    if (format === 'hex') {
        return color.hex()
    }
    // round 后输出可读的 rgb/hsl 字符串
    return color.round().string()
}

/**
 * 将任意 color-like 转为 "R,G,B" 字符串（不包含空格）。
 * @param color ColorLike (如 '#ff0000' / {r,g,b} / ...)
 * @returns "R,G,B"
 */
export const getRgbStr = (color: ColorLike): string => {
    return Color(color).rgb().round().array().join(',')
}

/* ---------------------- 内部工具函数 ---------------------- */

/**
 * 将角度归一化到 [0, 360) 并四舍五入为整数
 * @param deg 角度
 */
function normalizeHue(deg: number): number {
    let h = Math.round(deg) % 360
    if (h < 0) h += 360
    return h
}

/**
 * 将数值限制到 [min, max]
 */
export const clamp = (n: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, n))
}

/**
 * 把 ColorLike 转为 HSV 三元组 (h,s,v)，s/v 在 0 - 100 范围内
 */
export const toHSV = (color: ColorLike) => {
    const c = Color(color)
    return {
        h: c.hue(),
        s: c.saturationv(),
        v: c.value()
    }
}

/**
 * 根据基础 hue、是否为“更亮”的方向、步长和步数，计算新的 hue（保持在 [0,360)）
 * @param baseHue 基色 hue
 * @param isLight 是否为“更亮”的方向
 * @param stepDeg 每一步的度数（默认 2）
 * @param stepIndex 步数（应为正整数）
 */
export const computeHue = (
    baseHue: number,
    isLight: boolean,
    stepIndex: number,
    stepDeg = 2
) => {
    // 根据原算法：当 hue 在 [60,240] 区间时，亮色方向为减 hue，否则为加 hue
    const direction =
        baseHue >= 60 && baseHue <= 240 ? (isLight ? -1 : 1) : isLight ? 1 : -1
    const newHue = baseHue + direction * stepDeg * stepIndex
    return normalizeHue(newHue)
}

/**
 * 计算亮色方向的饱和度（保留原算法思路）
 * @param s 原始饱和度 (0-100)
 * @param stepIndex 步数（>=0）
 * @param minSat 最小饱和度阈值（默认 9）
 */
export const computeLightSaturation = (
    s: number,
    stepIndex: number,
    minSat = 9
) => {
    if (s <= minSat) return s
    // 将原公式中分成 5 步的比例分配到 stepIndex
    const perStep = (s - minSat) / 5
    const newS = s - perStep * stepIndex
    return clamp(newS, 0, 100)
}

/**
 * 计算暗色方向的饱和度（保留原算法思路）
 * @param s 原始饱和度 (0-100)
 * @param stepIndex 步数（>=0）
 * @param maxSat 默认 100
 */
export const computeDarkSaturation = (
    s: number,
    stepIndex: number,
    maxSat = 100
) => {
    // 原始算法：s + ((max - s)/4) * i
    const perStep = (maxSat - s) / 4
    const newS = s + perStep * stepIndex
    return clamp(newS, 0, 100)
}

/**
 * 计算亮色方向的明度/value (v)
 * @param v 原始 v (0-100)
 * @param stepIndex 步数（>=0）
 */
export const computeLightValue = (
    v: number,
    stepIndex: number,
    maxValue = 100
) => {
    const perStep = (maxValue - v) / 5
    const newV = v + perStep * stepIndex
    return clamp(newV, 0, 100)
}

/**
 * 计算暗色方向的明度/value (v)
 * @param v 原始 v (0-100)
 * @param stepIndex 步数（>=0）
 * @param minValue 最小值（默认 30）
 */
export const computeDarkValue = (
    v: number,
    stepIndex: number,
    minValue = 30
) => {
    if (v <= minValue) return v
    const perStep = (v - minValue) / 4
    const newV = v - perStep * stepIndex
    return clamp(newV, 0, 100)
}
