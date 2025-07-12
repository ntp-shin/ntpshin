import React from "react"
import PostHeader from "./PostHeader"
import Footer from "./PostFooter"
import CommentBox from "./CommentBox"
import Category from "src/components/Category"
import TableOfContents from "src/components/TableOfContents"
import MobileTableOfContents from "src/components/MobileTableOfContents"
import styled from "@emotion/styled"
import NotionRenderer from "../components/NotionRenderer"
import usePostQuery from "src/hooks/usePostQuery"

type Props = {}

const PostDetail: React.FC<Props> = () => {
  const data = usePostQuery()

  if (!data) return null

  const category = (data.category && data.category?.[0]) || undefined

  return (
    <StyledWrapper>
      <StyledContainer>
        <StyledMainContent>
          <article>
            {category && (
              <div css={{ marginBottom: "0.5rem" }}>
                <Category readOnly={data.status?.[0] === "PublicOnDetail"}>
                  {category}
                </Category>
              </div>
            )}
            {data.type[0] === "Post" && <PostHeader data={data} />}
            <div>
              <NotionRenderer recordMap={data.recordMap} />
            </div>
            {data.type[0] === "Post" && (
              <>
                <Footer />
                <CommentBox data={data} />
              </>
            )}
          </article>
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

export default PostDetail

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
  
  > article {
    margin: 0 auto;
    max-width: 42rem;
  }
  
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
