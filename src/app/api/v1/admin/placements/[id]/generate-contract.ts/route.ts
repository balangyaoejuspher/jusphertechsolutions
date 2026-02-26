import { NextRequest, NextResponse } from "next/server"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { apiResponse, apiError } from "@/lib/api/version"
import { placementService } from "@/server/services"
import { siteConfig } from "@/config/site"
import { verifyApiRequest, isVerifyError, isVerifyAdmin } from "@/lib/api/verify-request"

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const result = await verifyApiRequest(req, "admin")
    if (isVerifyError(result)) return result.error
    if (!isVerifyAdmin(result)) return apiError("Forbidden", "Admins only", 403)

    const { id } = await params
    const placement = await placementService.getById(id)
    if (!placement) return apiError("Not Found", "Placement not found", 404)

    try {
        const pdfBytes = await generateContract(placement)

        const base64 = Buffer.from(pdfBytes).toString("base64")

        await placementService.update(id, {
            inquiryStatus: "contract_generated",
            contractGeneratedAt: new Date(),
        }, result.admin.id, result.admin.name)

        return apiResponse({
            pdf: base64,
            filename: `contract-${placement.talentName.replace(/\s+/g, "-").toLowerCase()}-${placement.clientName.replace(/\s+/g, "-").toLowerCase()}.pdf`,
        })
    } catch (err: any) {
        return apiError("Internal Server Error", err.message, 500)
    }
}

async function generateContract(placement: any): Promise<Uint8Array> {
    const doc = await PDFDocument.create()
    const page = doc.addPage([595.28, 841.89]) // A4
    const { width, height } = page.getSize()

    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)
    const fontRegular = await doc.embedFont(StandardFonts.Helvetica)
    const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique)

    const COLOR_BLACK = rgb(0.1, 0.1, 0.1)
    const COLOR_GRAY = rgb(0.45, 0.45, 0.45)
    const COLOR_LIGHT = rgb(0.85, 0.85, 0.85)
    const COLOR_AMBER = rgb(0.98, 0.75, 0.15)
    const COLOR_WHITE = rgb(1, 1, 1)

    const margin = 56
    const contentWidth = width - margin * 2

    let y = height - 40

    // ── Header bar ──
    page.drawRectangle({ x: 0, y: height - 70, width, height: 70, color: rgb(0.09, 0.09, 0.09) })
    page.drawText(siteConfig.name.toUpperCase(), {
        x: margin, y: height - 38, size: 18, font: fontBold, color: COLOR_WHITE,
    })
    page.drawText(siteConfig.slogan?.toUpperCase() ?? "TECH SOLUTIONS", {
        x: margin, y: height - 56, size: 7.5, font: fontRegular, color: COLOR_AMBER,
    })
    page.drawText(`Generated: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`, {
        x: width - margin - 140, y: height - 46, size: 8.5, font: fontRegular, color: rgb(0.6, 0.6, 0.6),
    })

    y = height - 100

    // ── Title ──
    page.drawText("SERVICE PLACEMENT AGREEMENT", {
        x: margin, y, size: 15, font: fontBold, color: COLOR_BLACK,
    })
    y -= 10
    page.drawRectangle({ x: margin, y, width: contentWidth, height: 2, color: COLOR_AMBER })
    y -= 20

    page.drawText("This Service Placement Agreement (\"Agreement\") is entered into as of the date first written above, by and among:", {
        x: margin, y, size: 8.5, font: fontRegular, color: COLOR_GRAY, maxWidth: contentWidth,
    })
    y -= 30

    // ── Parties ──
    const drawParty = (label: string, name: string, detail: string, yStart: number) => {
        page.drawRectangle({ x: margin, y: yStart - 48, width: contentWidth, height: 54, color: rgb(0.97, 0.97, 0.97) })
        page.drawRectangle({ x: margin, y: yStart - 48, width: 3, height: 54, color: COLOR_AMBER })
        page.drawText(label, { x: margin + 12, y: yStart - 14, size: 7, font: fontBold, color: COLOR_AMBER })
        page.drawText(name, { x: margin + 12, y: yStart - 28, size: 10, font: fontBold, color: COLOR_BLACK })
        page.drawText(detail, { x: margin + 12, y: yStart - 42, size: 8, font: fontRegular, color: COLOR_GRAY })
        return yStart - 64
    }

    y = drawParty("PARTY 1 — SERVICE COMPANY", siteConfig.fullName ?? siteConfig.name, "hereinafter referred to as \"The Company\"", y)
    y = drawParty("PARTY 2 — CLIENT", placement.clientName, "hereinafter referred to as \"The Client\"", y)
    y = drawParty("PARTY 3 — TALENT / ASSIGNEE", placement.talentName, `Role: ${placement.role} · hereinafter referred to as \"The Assignee\"`, y)

    y -= 8

    // ── Section helper ──
    const drawSection = (title: string, yStart: number) => {
        page.drawText(title, { x: margin, y: yStart, size: 9.5, font: fontBold, color: COLOR_BLACK })
        page.drawRectangle({ x: margin, y: yStart - 5, width: contentWidth, height: 0.75, color: COLOR_LIGHT })
        return yStart - 18
    }

    const drawRow = (label: string, value: string, yStart: number) => {
        page.drawText(label, { x: margin, y: yStart, size: 8, font: fontBold, color: COLOR_GRAY })
        page.drawText(value, { x: margin + 120, y: yStart, size: 8, font: fontRegular, color: COLOR_BLACK })
        return yStart - 14
    }

    const drawBody = (text: string, yStart: number) => {
        page.drawText(text, {
            x: margin, y: yStart, size: 8, font: fontRegular, color: COLOR_GRAY, maxWidth: contentWidth, lineHeight: 13,
        })
        // Estimate lines
        const charsPerLine = Math.floor(contentWidth / 4.6)
        const lines = Math.ceil(text.length / charsPerLine)
        return yStart - (lines * 13) - 6
    }

    // ── Section 1: Placement Details ──
    y = drawSection("1. PLACEMENT DETAILS", y)
    y = drawRow("Role / Position:", placement.role, y)
    y = drawRow("Project:", placement.projectTitle ?? "General Services", y)
    y = drawRow("Start Date:", new Date(placement.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), y)
    y = drawRow("End Date:", placement.endDate ? new Date(placement.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Ongoing / To be determined", y)
    y = drawRow("Hours per Week:", placement.hoursPerWeek ? `${placement.hoursPerWeek} hours` : "To be agreed", y)
    y -= 10

    // ── Section 2: Compensation ──
    y = drawSection("2. COMPENSATION", y)
    y = drawRow("Hourly Rate:", placement.hourlyRate ? `$${parseFloat(placement.hourlyRate).toFixed(2)} USD per hour` : "To be agreed upon", y)
    if (placement.hourlyRate && placement.hoursPerWeek) {
        const weekly = parseFloat(placement.hourlyRate) * placement.hoursPerWeek
        y = drawRow("Estimated Weekly:", `$${weekly.toFixed(2)} USD`, y)
    }
    y = drawBody("Payment shall be made by The Client to The Company per the agreed billing cycle. The Company shall remit the Assignee's portion as per the separate contractor agreement.", y)
    y -= 6

    // ── Section 3: Scope of Work ──
    y = drawSection("3. SCOPE OF WORK", y)
    y = drawBody(
        placement.description
            ? placement.description
            : `The Assignee shall perform duties consistent with the role of ${placement.role} as reasonably directed by The Client. The scope of work may be updated by mutual written agreement between all parties.`,
        y
    )
    y -= 6

    // ── Section 4: Obligations ──
    y = drawSection("4. OBLIGATIONS", y)
    y = drawBody("The Company agrees to: (a) provide qualified talent for the agreed role; (b) ensure the Assignee meets the required availability; (c) handle payroll and HR matters for the Assignee.", y)
    y = drawBody("The Client agrees to: (a) provide the necessary tools, access, and environment; (b) treat the Assignee with respect; (c) provide timely feedback and direction.", y)
    y = drawBody("The Assignee agrees to: (a) perform duties diligently and professionally; (b) maintain confidentiality of Client's proprietary information; (c) adhere to Client's reasonable workplace policies.", y)
    y -= 6

    // ── Section 5: Confidentiality ──
    y = drawSection("5. CONFIDENTIALITY", y)
    y = drawBody("All parties agree to maintain the confidentiality of any proprietary, sensitive, or non-public information encountered during the term of this Agreement and for a period of two (2) years thereafter.", y)
    y -= 6

    // ── Section 6: Termination ──
    y = drawSection("6. TERMINATION", y)
    y = drawBody("Either party may terminate this Agreement with fourteen (14) days' written notice. Immediate termination may occur in cases of material breach, misconduct, or violation of confidentiality obligations.", y)
    y -= 16

    // ── Signature Block ──
    if (y < 160) {
        doc.addPage([595.28, 841.89])
        y = 780
    }

    page.drawRectangle({ x: margin, y: y - 10, width: contentWidth, height: 0.75, color: COLOR_LIGHT })
    y -= 24
    page.drawText("SIGNATURES", { x: margin, y, size: 9.5, font: fontBold, color: COLOR_BLACK })
    y -= 18
    page.drawText("By signing below, all parties agree to the terms and conditions set forth in this Agreement.", {
        x: margin, y, size: 8, font: fontItalic, color: COLOR_GRAY, maxWidth: contentWidth,
    })
    y -= 28

    const sigColW = (contentWidth - 20) / 3
    const sigBoxH = 64
    const sigLabels = [
        { title: "The Company", name: siteConfig.fullName ?? siteConfig.name, role: "Authorized Representative" },
        { title: "The Client", name: placement.clientName, role: "Authorized Signatory" },
        { title: "The Assignee", name: placement.talentName, role: placement.role },
    ]

    sigLabels.forEach((sig, i) => {
        const x = margin + i * (sigColW + 10)
        page.drawRectangle({ x, y: y - sigBoxH, width: sigColW, height: sigBoxH, color: rgb(0.97, 0.97, 0.97) })
        page.drawRectangle({ x, y: y - sigBoxH, width: sigColW, height: 2, color: COLOR_AMBER })
        page.drawText(sig.title.toUpperCase(), { x: x + 8, y: y - 14, size: 6.5, font: fontBold, color: COLOR_AMBER })
        page.drawText(sig.name, { x: x + 8, y: y - 26, size: 8.5, font: fontBold, color: COLOR_BLACK })
        page.drawText(sig.role, { x: x + 8, y: y - 38, size: 7, font: fontRegular, color: COLOR_GRAY })
        page.drawText("Signature: ___________________", { x: x + 8, y: y - 54, size: 7, font: fontRegular, color: COLOR_LIGHT })
    })

    y -= sigBoxH + 20

    // ── Footer ──
    page.drawText(`${siteConfig.name} · Confidential · This document is legally binding upon execution by all parties.`, {
        x: margin, y: 28, size: 7, font: fontItalic, color: rgb(0.65, 0.65, 0.65),
    })
    page.drawRectangle({ x: 0, y: 0, width, height: 18, color: rgb(0.09, 0.09, 0.09) })
    page.drawText("CONFIDENTIAL — DO NOT DISTRIBUTE WITHOUT AUTHORIZATION", {
        x: margin, y: 5, size: 6, font: fontBold, color: rgb(0.4, 0.4, 0.4),
    })

    return doc.save()
}
