import { generate } from './generate'
export { getRgbStr } from './utils'

export { generate }

/** 颜色字符串映射表 */
const colorList: Record<string, string> = {
    red: '#F53F3F',
    orangered: '#F77234',
    orange: '#FF7D00',
    gold: '#F7BA1E',
    yellow: '#FADC19',
    lime: '#9FDB1D',
    green: '#00B42A',
    cyan: '#14C9C9',
    blue: '#3491FA',
    arcoblue: '#165DFF',
    purple: '#722ED1',
    pinkpurple: '#D91AD9',
    magenta: '#F5319D'
}

/** 单个颜色的预设值 */
export interface PresetColor {
    /** 浅色模式的 10 个梯度 */
    light: string[]
    /** 暗色模式的 10 个梯度 */
    dark: string[]
    /** 主色 */
    primary: string
}

/** 所有预设颜色映射 */
export type PresetColors = Record<string, PresetColor>

/**
 * 获取预设颜色对象，包括常见的色系和 gray 系列
 * @returns 所有预设颜色映射
 */
export function getPresetColors(): PresetColors {
    const presetColors: Partial<PresetColors> = {}

    // 基础色系
    for (const [key, baseColor] of Object.entries(colorList)) {
        presetColors[key] = {
            light: generate(baseColor, { list: true }) as string[],
            dark: generate(baseColor, { list: true, dark: true }) as string[],
            primary: baseColor
        }
    }

    // 灰色系列（固定预设值）
    presetColors.gray = {
        light: [
            '#f7f8fa',
            '#f2f3f5',
            '#e5e6eb',
            '#c9cdd4',
            '#a9aeb8',
            '#86909c',
            '#6b7785',
            '#4e5969',
            '#272e3b',
            '#1d2129'
        ],
        dark: [
            '#17171a',
            '#2e2e30',
            '#484849',
            '#5f5f60',
            '#78787a',
            '#929293',
            '#ababac',
            '#c5c5c5',
            '#dfdfdf',
            '#f6f6f6'
        ],
        primary: '#6b7785'
    }

    return presetColors as PresetColors
}
