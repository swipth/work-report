import {defineConfig} from 'vitepress'
import {withMermaid} from 'vitepress-plugin-mermaid'

/** 周报时间轴：按周倒序，首页默认跳转最新有内容的周报 */
const weeks = [
    {
        id: '2026-06-22',
        label: '2026-06-22 ~ 06-28',
        title: '本周',
        hasContent: true,
    },
    {
        id: '2026-06-15',
        label: '2026-06-15 ~ 06-21',
        title: '上一周',
        hasContent: true,
    },
    {
        id: '2026-06-08',
        label: '2026-06-08 ~ 06-14',
        title: '上两周',
        hasContent: true,
    },
    {
        id: '2026-06-01',
        label: '2026-06-01 ~ 06-07',
        title: '上三周',
        hasContent: true,
    },
    {
        id: '2026-05-25',
        label: '2026-05-25 ~ 05-31',
        title: '上四周',
        hasContent: true,
    },
]

const latestWeek = weeks.find((w) => w.hasContent) ?? weeks[0]

export default withMermaid(
    defineConfig({
        title: '工作周报',
        description: '基于 VitePress 的每周工作汇报',
        lang: 'zh-CN',
        cleanUrls: true,
        lastUpdated: true,

        themeConfig: {
            nav: [
                {text: '首页', link: '/'},
                {text: '最新周报', link: `/reports/${latestWeek.id}/`},
            ],

            sidebar: [
                {
                    text: '周报归档',
                    items: weeks.map((w) => ({
                        text: `${w.label} · ${w.title}`,
                        link: `/reports/${w.id}/`,
                    })),
                },
            ],

            outline: {level: [2, 3]},
            socialLinks: [],
            footer: {
                message: '千寻平台 · 工作周报',
                copyright: 'Copyright © 2026',
            },
        },

        markdown: {
            theme: {
                light: 'github-light',
                dark: 'github-dark',
            },
        },

        vite: {
            server: {port: 5175},
        },

        mermaid: {
            theme: 'default',
        },
    }),
)
