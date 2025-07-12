import { useEffect, useState } from 'react'

export interface TocItem {
  id: string
  text: string
  level: number
}

interface Position {
  x: number
  y: number
}

const useTableOfContents = () => {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [position, setPosition] = useState<Position>({ x: 0, y: 120 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 })

  useEffect(() => {
    // Extract headings from the DOM
    const extractHeadings = () => {
      // Target react-notion-x heading classes
      const headings = document.querySelectorAll('.notion-h1, .notion-h2, .notion-h3')
      const tocItems: TocItem[] = []

      headings.forEach((heading, index) => {
        const text = heading.textContent?.trim() || ''
        if (!text) return

        const level = heading.classList.contains('notion-h1') ? 1 
                    : heading.classList.contains('notion-h2') ? 2 
                    : 3
        
        // Create or use existing id
        let id = heading.id
        if (!id) {
          id = `toc-heading-${index}-${text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50)}`
          heading.id = id
        }

        tocItems.push({ id, text, level })
      })

      setToc(tocItems)
    }

    // Wait for NotionRenderer to render and then extract headings
    const checkAndExtract = () => {
      const notionContent = document.querySelector('.notion-page')
      if (notionContent) {
        extractHeadings()
      } else {
        // Retry after a short delay if content isn't ready
        setTimeout(checkAndExtract, 500)
      }
    }

    // Initial extraction
    const timer = setTimeout(checkAndExtract, 1000)
    
    // Listen for content changes
    const observer = new MutationObserver((mutations) => {
      const hasNotionChanges = mutations.some(mutation => 
        Array.from(mutation.addedNodes).some(node => 
          node.nodeType === Node.ELEMENT_NODE && 
          (node as Element).classList?.contains('notion-page')
        )
      )
      
      if (hasNotionChanges) {
        setTimeout(extractHeadings, 300)
      }
    })
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    })

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (toc.length === 0) return

    // Intersection Observer to track which heading is currently visible
    const observerOptions = {
      rootMargin: '-100px 0px -66% 0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting)
      
      if (visibleEntries.length > 0) {
        // Find the topmost visible heading
        const topEntry = visibleEntries.reduce((top, entry) => 
          entry.boundingClientRect.top < top.boundingClientRect.top ? entry : top
        )
        setActiveId(topEntry.target.id)
      }
    }, observerOptions)

    // Observe all headings
    toc.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [toc])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -100 // Offset for fixed header and spacing
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      
      // Update active ID immediately for better UX
      setActiveId(id)
    }
  }

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y
    
    // Constrain to viewport bounds
    const maxX = window.innerWidth - 320 // TOC width + padding
    const maxY = window.innerHeight - 200 // TOC height estimate
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(120, Math.min(newY, maxY))
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isDragging, dragStart, position])

  return { 
    toc, 
    activeId, 
    scrollToHeading, 
    position, 
    isDragging,
    handleMouseDown 
  }
}

export default useTableOfContents
