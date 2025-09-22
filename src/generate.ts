import type { ColorLike } from 'color'
import { colorPalette } from './palette'
import { colorPaletteDark } from './palette-dark'
import type { ColorFormat } from './utils'

/**
 * 颜色生成函数配置项
 */
export interface GenerateOptions {
    /** 索引 1-10，默认 6 表示基色 */
    index?: number
    /** 是否生成暗色梯度 */
    dark?: boolean
    /** 是否返回完整色板列表（1-10） */
    list?: boolean
    /** 输出格式 'hex' | 'rgb' | 'hsl'，默认 'hex' */
    format?: ColorFormat
}

/**
 * 根据输入颜色生成指定的梯度颜色或完整色板
 *
 * @param color 基础颜色（ColorLike，例如 '#1890ff'）
 * @param options 配置项
 * @returns 单个颜色字符串 或 颜色字符串数组
 */
export function generate(
    color: ColorLike,
    options: GenerateOptions = {}
): string | string[] {
    const { dark = false, list = false, index = 6, format = 'hex' } = options

    if (list) {
        const func = dark ? colorPaletteDark : colorPalette
        return Array.from({ length: 10 }, (_, i) => func(color, i + 1, format))
    }

    return dark
        ? colorPaletteDark(color, index, format)
        : colorPalette(color, index, format)
}
