import React from "react"
import styled from "@emotion/styled"
import NotionRenderer from "../components/NotionRenderer"
import TableOfContents from "src/components/TableOfContents"
import MobileTableOfContents from "src/components/MobileTableOfContents"
import usePostQuery from "src/hooks/usePostQuery"

type Props = {}

const PageDetail: React.FC<Props> = () => {
  const data = usePostQuery()

  if (!data) return null
  return (
    <StyledWrapper>
      <StyledContainer>
        <StyledMainContent>
          <NotionRenderer recordMap={data.recordMap} />
        </StyledMainContent>
        
        <StyledSidebar>
          {/* Placeholder for draggable TOC */}
        </StyledSidebar>
      </StyledContainer>
      
      {/* Draggable TOC - positioned absolutely */}
      <TableOfContents />
      
      {/* Mobile TOC */}
      <MobileTableOfContents />
    </StyledWrapper>
  )
}

export default PageDetail

const StyledWrapper = styled.div`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
  max-width: 1400px;
  margin: 0 auto;
`

const StyledContainer = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  
  @media (max-width: 1200px) {
    flex-direction: column;
  }
`

const StyledMainContent = styled.div`
  flex: 1;
  min-width: 0;
  border-radius: 1.5rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "white" : theme.colors.gray4};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 3rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

const StyledSidebar = styled.aside`
  width: 280px;
  flex-shrink: 0;
  
  @media (max-width: 1200px) {
    width: 100%;
  }
`
