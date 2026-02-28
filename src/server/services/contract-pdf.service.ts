import { PDFDocument, rgb, StandardFonts, PageSizes } from "pdf-lib"
import { COMPANY } from "@/lib/contracts/variables"

const MARGIN = 60
const PAGE_WIDTH = PageSizes.A4[0]   // 595
const PAGE_HEIGHT = PageSizes.A4[1]   // 842
const CONTENT_W = PAGE_WIDTH - MARGIN * 2

// Colors
const COLOR_BLACK = rgb(0.1, 0.1, 0.1)
const COLOR_GRAY = rgb(0.45, 0.45, 0.45)
const COLOR_LIGHT = rgb(0.85, 0.85, 0.85)
const COLOR_ACCENT = rgb(0.98, 0.75, 0.15)  // amber

interface ContractPDFInput {
    title: string
    body: string
    clientName: string
    projectTitle?: string
    contractDate: string
    signerName?: string
    signerEmail?: string
}

export async function generateContractPDF(input: ContractPDFInput): Promise<Uint8Array> {
    const doc = await PDFDocument.create()
    const fontReg = await doc.embedFont(StandardFonts.Helvetica)
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

    doc.setTitle(input.title)
    doc.setAuthor(COMPANY.name)
    doc.setCreationDate(new Date())

    const addPage = () => {
        const page = doc.addPage(PageSizes.A4)
        return { page, y: PAGE_HEIGHT - MARGIN }
    }

    let { page, y } = addPage()

    const ensureSpace = (needed: number) => {
        if (y - needed < MARGIN + 40) {
            drawFooter(page, doc.getPageCount())
                ; ({ page, y } = addPage())
            y -= 10
        }
    }

    const drawText = (
        text: string,
        {
            font = fontReg,
            size = 10,
            color = COLOR_BLACK,
            indent = 0,
            lineGap = 4,
            maxWidth = CONTENT_W,
        }: {
            font?: typeof fontReg
            size?: number
            color?: typeof COLOR_BLACK
            indent?: number
            lineGap?: number
            maxWidth?: number
        } = {}
    ): number => {
        const effectiveWidth = maxWidth - indent
        const words = text.split(" ")
        let line = ""
        let totalHeight = 0

        for (const word of words) {
            const test = line ? `${line} ${word}` : word
            const w = font.widthOfTextAtSize(test, size)
            if (w > effectiveWidth && line) {
                ensureSpace(size + lineGap)
                page.drawText(line, { x: MARGIN + indent, y, size, font, color })
                y -= size + lineGap
                totalHeight += size + lineGap
                line = word
            } else {
                line = test
            }
        }

        if (line) {
            ensureSpace(size + lineGap)
            page.drawText(line, { x: MARGIN + indent, y, size, font, color })
            y -= size + lineGap
            totalHeight += size + lineGap
        }

        return totalHeight
    }

    const drawRule = (color = COLOR_LIGHT, thickness = 0.5) => {
        ensureSpace(10)
        page.drawLine({
            start: { x: MARGIN, y: y + 4 },
            end: { x: PAGE_WIDTH - MARGIN, y: y + 4 },
            thickness,
            color,
        })
        y -= 10
    }

    const drawFooter = (p: typeof page, pageNum: number) => {
        p.drawLine({
            start: { x: MARGIN, y: MARGIN + 20 },
            end: { x: PAGE_WIDTH - MARGIN, y: MARGIN + 20 },
            thickness: 0.5,
            color: COLOR_LIGHT,
        })
        p.drawText(COMPANY.name, {
            x: MARGIN, y: MARGIN + 6,
            size: 7, font: fontReg, color: COLOR_GRAY,
        })
        p.drawText(`Page ${pageNum}`, {
            x: PAGE_WIDTH - MARGIN - 30, y: MARGIN + 6,
            size: 7, font: fontReg, color: COLOR_GRAY,
        })
        p.drawText("Confidential", {
            x: PAGE_WIDTH / 2 - 20, y: MARGIN + 6,
            size: 7, font: fontReg, color: COLOR_GRAY,
        })
    }

    page.drawRectangle({
        x: 0, y: PAGE_HEIGHT - 8,
        width: PAGE_WIDTH, height: 8,
        color: COLOR_ACCENT,
    })

    y = PAGE_HEIGHT - 60

    page.drawText(COMPANY.name, {
        x: MARGIN, y,
        size: 11, font: fontBold, color: COLOR_GRAY,
    })
    y -= 18

    const titleWords = input.title.split(" ")
    page.drawText(input.title, {
        x: MARGIN, y,
        size: titleWords.length > 4 ? 22 : 26,
        font: fontBold,
        color: COLOR_BLACK,
    })
    y -= 36

    drawRule(COLOR_ACCENT, 1.5)
    y -= 10

    // Meta grid
    const metaItems = [
        { label: "Prepared for", value: input.clientName },
        { label: "Prepared by", value: COMPANY.name },
        { label: "Date", value: input.contractDate },
        ...(input.projectTitle ? [{ label: "Project", value: input.projectTitle }] : []),
    ]

    for (const item of metaItems) {
        page.drawText(item.label.toUpperCase(), {
            x: MARGIN, y,
            size: 7, font: fontBold, color: COLOR_GRAY,
        })
        y -= 13
        page.drawText(item.value, {
            x: MARGIN, y,
            size: 10, font: fontReg, color: COLOR_BLACK,
        })
        y -= 20
    }

    y -= 20
    drawRule()

    page.drawText(`${COMPANY.address}  ·  ${COMPANY.email}  ·  ${COMPANY.website}`, {
        x: MARGIN, y,
        size: 8, font: fontReg, color: COLOR_GRAY,
    })

    drawFooter(page, 1)

        ; ({ page, y } = addPage())

    page.drawRectangle({
        x: 0, y: PAGE_HEIGHT - 8,
        width: PAGE_WIDTH, height: 8,
        color: COLOR_ACCENT,
    })

    y = PAGE_HEIGHT - MARGIN - 10

    const lines = input.body.split("\n")

    for (const raw of lines) {
        const line = raw.trim()

        if (!line) {
            y -= 8  // paragraph gap
            continue
        }

        if (line.startsWith("## ")) {
            const text = line.replace(/^## /, "")
            ensureSpace(28)
            y -= 6
            page.drawText(text, {
                x: MARGIN, y,
                size: 11, font: fontBold, color: COLOR_BLACK,
            })
            y -= 14
            drawRule(COLOR_LIGHT, 0.5)
            continue
        }

        if (line.startsWith("# ")) {
            const text = line.replace(/^# /, "")
            ensureSpace(36)
            y -= 10

            // Section number background
            page.drawRectangle({
                x: MARGIN - 4, y: y - 4,
                width: CONTENT_W + 8, height: 22,
                color: rgb(0.97, 0.97, 0.97),
            })

            page.drawText(text, {
                x: MARGIN, y,
                size: 13, font: fontBold, color: COLOR_BLACK,
            })
            y -= 22
            continue
        }

        if (line.startsWith("- ")) {
            const text = line.replace(/^- /, "")
            ensureSpace(16)
            page.drawText("•", { x: MARGIN + 4, y, size: 10, font: fontReg, color: COLOR_BLACK })
            drawText(text, { indent: 16, size: 10, color: COLOR_BLACK })
            continue
        }

        // Regular paragraph
        drawText(line, { size: 10, color: COLOR_BLACK, lineGap: 5 })
        y -= 3
    }

    ensureSpace(200)
    y -= 20

    drawRule(COLOR_ACCENT, 1)
    y -= 10

    page.drawText("SIGNATURES", {
        x: MARGIN, y,
        size: 13, font: fontBold, color: COLOR_BLACK,
    })
    y -= 8
    drawText("By signing below, both parties agree to the terms of this agreement.", {
        size: 9, color: COLOR_GRAY,
    })
    y -= 20

    // Two-column signature blocks
    const col1x = MARGIN
    const col2x = PAGE_WIDTH / 2 + 10
    const sigY = y

    // Left: Service Provider
    page.drawText("SERVICE PROVIDER", { x: col1x, y: sigY, size: 7, font: fontBold, color: COLOR_GRAY })
    page.drawText(COMPANY.name, { x: col1x, y: sigY - 14, size: 10, font: fontBold, color: COLOR_BLACK })
    page.drawText(COMPANY.email, { x: col1x, y: sigY - 27, size: 9, font: fontReg, color: COLOR_GRAY })
    page.drawLine({
        start: { x: col1x, y: sigY - 55 },
        end: { x: col1x + 180, y: sigY - 55 },
        thickness: 0.75, color: COLOR_LIGHT,
    })
    page.drawText("Signature", { x: col1x, y: sigY - 65, size: 7, font: fontReg, color: COLOR_GRAY })
    page.drawLine({
        start: { x: col1x, y: sigY - 80 },
        end: { x: col1x + 180, y: sigY - 80 },
        thickness: 0.75, color: COLOR_LIGHT,
    })
    page.drawText("Date", { x: col1x, y: sigY - 90, size: 7, font: fontReg, color: COLOR_GRAY })

    // Right: Client
    page.drawText("CLIENT", { x: col2x, y: sigY, size: 7, font: fontBold, color: COLOR_GRAY })
    page.drawText(input.signerName ?? input.clientName, { x: col2x, y: sigY - 14, size: 10, font: fontBold, color: COLOR_BLACK })
    page.drawText(input.signerEmail ?? "", { x: col2x, y: sigY - 27, size: 9, font: fontReg, color: COLOR_GRAY })
    page.drawLine({
        start: { x: col2x, y: sigY - 55 },
        end: { x: col2x + 180, y: sigY - 55 },
        thickness: 0.75, color: COLOR_LIGHT,
    })
    page.drawText("Signature", { x: col2x, y: sigY - 65, size: 7, font: fontReg, color: COLOR_GRAY })
    page.drawLine({
        start: { x: col2x, y: sigY - 80 },
        end: { x: col2x + 180, y: sigY - 80 },
        thickness: 0.75, color: COLOR_LIGHT,
    })
    page.drawText("Date", { x: col2x, y: sigY - 90, size: 7, font: fontReg, color: COLOR_GRAY })

    y = sigY - 110

    drawFooter(page, doc.getPageCount())

    return doc.save()
}