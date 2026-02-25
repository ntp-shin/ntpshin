import React, { useEffect, useState, useCallback, useRef, useMemo } from "react"
import styled from "@emotion/styled"
import { ExtendedRecordMap } from "notion-types"
import { getPageTableOfContents, uuidToId } from "notion-utils"
import { respondMobile } from "src/styles/media"

type TocEntry = {
  id: string
  type: string
  text: string
  indentLevel: number
}

type Props = {
  recordMap: ExtendedRecordMap
}

/**
 * Find a heading DOM element by its notion block ID.
 * react-notion-x renders headings as:
 *   <h2 class="notion-h notion-h1 notion-block-{shortId}" data-id="{shortId}">
 *     <span><div id="{shortId}" class="notion-header-anchor" /></span>
 *   </h2>
 * For toggleable headings, wrapped in:
 *   <details class="notion-toggle notion-block-{shortId}">
 */
const findBlockElement = (blockId: string): HTMLElement | null => {
  const shortId = uuidToId(blockId)
  return (
    document.querySelector(`[data-id="${shortId}"]`) ||
    document.querySelector(`.notion-block-${shortId}`) ||
    document.getElementById(shortId)
  )
}

const TableOfContents: React.FC<Props> = ({ recordMap }) => {
  const [activeId, setActiveId] = useState<string>("")
  const [isHovered, setIsHovered] = useState(false)
  const tocRef = useRef<HTMLDivElement>(null)
  const activeItemRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number>(0)

  const tocItems: TocEntry[] = useMemo(() => {
    if (!recordMap) return []
    const blockIds = Object.keys(recordMap.block)
    const pageBlockId = blockIds[0]
    const pageBlock = recordMap.block[pageBlockId]?.value
    if (!pageBlock) return []

    try {
      return getPageTableOfContents(pageBlock as any, recordMap)
    } catch {
      return []
    }
  }, [recordMap])

  // Scroll-spy: track which heading is currently in view
  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    rafRef.current = requestAnimationFrame(() => {
      if (!tocItems.length) return

      const headingPositions: { id: string; top: number }[] = []

      for (const item of tocItems) {
        const el = findBlockElement(item.id)
        if (el) {
          headingPositions.push({ id: item.id, top: el.getBoundingClientRect().top })
        }
      }

      if (!headingPositions.length) return

      // Find the last heading that scrolled past the top offset
      let currentId = ""
      const offset = 120

      for (const heading of headingPositions) {
        if (heading.top <= offset) {
          currentId = heading.id
        }
      }

      // If none scrolled past, use the first visible heading
      if (!currentId) {
        const firstVisible = headingPositions.find((h) => h.top > 0)
        currentId = firstVisible?.id || headingPositions[0].id
      }

      setActiveId(currentId)
    })
  }, [tocItems])

  useEffect(() => {
    if (!tocItems.length) return

    // react-notion-x is dynamically imported (ssr: false), so heading elements
    // may not exist in the DOM immediately. Retry until they appear.
    let retryCount = 0
    const maxRetries = 10
    const retryInterval = setInterval(() => {
      retryCount++
      const firstItem = tocItems[0]
      const el = findBlockElement(firstItem.id)
      if (el || retryCount >= maxRetries) {
        clearInterval(retryInterval)
        handleScroll()
      }
    }, 300)

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      clearInterval(retryInterval)
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [handleScroll, tocItems])

  // Auto-scroll the TOC panel to keep active item visible
  useEffect(() => {
    if (activeItemRef.current && tocRef.current) {
      const container = tocRef.current.querySelector(".toc-inner")
      if (container) {
        const itemRect = activeItemRef.current.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        if (
          itemRect.top < containerRect.top ||
          itemRect.bottom > containerRect.bottom
        ) {
          activeItemRef.current.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          })
        }
      }
    }
  }, [activeId])

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false)
    }, 300)
  }

  const handleClick = (id: string) => {
    const el = findBlockElement(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: "smooth" })
      setActiveId(id)
    }
  }

  // Don't render if too few headings
  if (tocItems.length < 2) return null

  return (
    <StyledTocWrapper
      ref={tocRef}
      data-expanded={isHovered}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="toc-inner">
        {tocItems.map((item) => {
          const isActive = activeId === item.id
          return (
            <div
              key={item.id}
              ref={isActive ? activeItemRef : undefined}
              className={`toc-item indent-${item.indentLevel} ${isActive ? "active" : ""}`}
              onClick={() => handleClick(item.id)}
              title={item.text}
            >
              <span className="toc-bar" />
              <span className="toc-text">{item.text}</span>
            </div>
          )
        })}
      </div>
    </StyledTocWrapper>
  )
}

export default TableOfContents

const StyledTocWrapper = styled.div`
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: ${({ theme }) => theme.zIndexes.hoverCard};
  max-height: 70vh;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${respondMobile} {
    display: none;
  }

  @media (max-width: 1200px) {
    display: none;
  }

  .toc-inner {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 8px;
    border-radius: 12px;
    overflow-y: auto;
    max-height: 70vh;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &::-webkit-scrollbar {
      width: 3px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.gray7};
      border-radius: 3px;
    }
  }

  /* ── Collapsed state ── */
  &[data-expanded="false"] {
    .toc-inner {
      background: ${({ theme }) =>
        theme.scheme === "light"
          ? "rgba(255, 255, 255, 0.8)"
          : "rgba(30, 30, 30, 0.8)"};
      backdrop-filter: blur(8px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
  }

  /* ── Expanded state ── */
  &[data-expanded="true"] {
    .toc-inner {
      background: ${({ theme }) =>
        theme.scheme === "light"
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(30, 30, 30, 0.95)"};
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      padding: 12px 16px;
    }
  }

  /* ── TOC item ── */
  .toc-item {
    display: flex;
    align-items: center;
    gap: 0;
    cursor: pointer;
    padding: 4px 0;
    border-radius: 4px;
    transition: all 0.2s ease;
    white-space: nowrap;
    overflow: hidden;

    &:hover {
      .toc-bar {
        background: ${({ theme }) => theme.colors.indigo9};
        opacity: 1;
        transform: scaleY(1.6);
      }
      .toc-text {
        color: ${({ theme }) => theme.colors.indigo9};
      }
    }

    /* ── Active heading highlight ── */
    &.active {
      .toc-bar {
        background: ${({ theme }) => theme.colors.indigo9};
        opacity: 1;
        transform: scaleY(2);
        box-shadow: 0 0 6px ${({ theme }) => theme.colors.indigo9}66;
      }
      .toc-text {
        color: ${({ theme }) => theme.colors.indigo9};
        font-weight: 600;
      }
    }
  }

  /* ── Bar widths by heading level ── */
  .toc-bar {
    display: block;
    height: 3px;
    border-radius: 2px;
    background: ${({ theme }) => theme.colors.gray8};
    opacity: 0.45;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
    transform-origin: center;
  }

  .indent-0 .toc-bar {
    width: 40px;
  }
  .indent-1 .toc-bar {
    width: 28px;
  }
  .indent-2 .toc-bar {
    width: 16px;
  }

  /* ── Text label ── */
  .toc-text {
    font-size: 0.8rem;
    line-height: 1.4;
    color: ${({ theme }) => theme.colors.gray11};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── Collapsed: hide text, show only bars ── */
  &[data-expanded="false"] {
    .toc-item {
      gap: 0;
    }
    .toc-text {
      max-width: 0;
      opacity: 0;
      margin-left: 0;
    }
    .indent-1 {
      padding-left: 12px;
    }
    .indent-2 {
      padding-left: 24px;
    }
  }

  /* ── Expanded: show text next to bars ── */
  &[data-expanded="true"] {
    .toc-item {
      gap: 10px;
      padding: 4px 6px;

      &:hover {
        background: ${({ theme }) =>
          theme.scheme === "light"
            ? "rgba(0, 0, 0, 0.04)"
            : "rgba(255, 255, 255, 0.06)"};
      }

      &.active {
        background: ${({ theme }) =>
          theme.scheme === "light"
            ? theme.colors.indigo3
            : "rgba(99, 102, 241, 0.12)"};
      }
    }

    .toc-text {
      max-width: 200px;
      opacity: 1;
    }
    .indent-0 .toc-text {
      font-size: 0.82rem;
      font-weight: 500;
    }
    .indent-1 {
      padding-left: 12px;
    }
    .indent-1 .toc-text {
      font-size: 0.78rem;
    }
    .indent-2 {
      padding-left: 24px;
    }
    .indent-2 .toc-text {
      font-size: 0.75rem;
    }
  }
`
