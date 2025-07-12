import { CONFIG } from "site.config"
import { useEffect, useRef } from "react"
import styled from "@emotion/styled"
import useScheme from "src/hooks/useScheme"
import { useRouter } from "next/router"

type Props = {
  issueTerm: string
}

const Utterances: React.FC<Props> = ({ issueTerm }) => {
  const [scheme] = useScheme()
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const theme = scheme === "light" ? "github-light" : "github-dark"
    const container = containerRef.current
    if (!container) return

    // Clear previous content safely
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }

    const script = document.createElement("script")
    script.setAttribute("src", "https://utteranc.es/client.js")
    script.setAttribute("crossorigin", "anonymous")
    script.setAttribute("async", "true")
    script.setAttribute("issue-term", issueTerm)
    script.setAttribute("theme", theme)
    
    const config: Record<string, string> = CONFIG.utterances.config
    Object.keys(config).forEach((key) => {
      script.setAttribute(key, config[key])
    })
    
    container.appendChild(script)
    
    return () => {
      // Safe cleanup - check if element still exists and has parent
      if (container && container.parentNode) {
        while (container.firstChild) {
          container.removeChild(container.firstChild)
        }
      }
    }
  }, [scheme, router, issueTerm])

  return (
    <StyledWrapper ref={containerRef}>
      <div className="utterances-frame"></div>
    </StyledWrapper>
  )
}

export default Utterances

const StyledWrapper = styled.div`
  @media (min-width: 768px) {
    margin-left: -4rem;
  }
`
