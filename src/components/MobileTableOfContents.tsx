import React, { useState } from 'react'
import styled from '@emotion/styled'
import useTableOfContents from 'src/hooks/useTableOfContents'

type Props = {}

const MobileTableOfContents: React.FC<Props> = () => {
  const { toc, activeId, scrollToHeading } = useTableOfContents()
  const [isOpen, setIsOpen] = useState(false)

  if (toc.length === 0) return null

  const handleItemClick = (id: string) => {
    scrollToHeading(id)
    setIsOpen(false)
  }

  return (
    <>
      <StyledFloatingButton
        onClick={() => setIsOpen(true)}
        aria-label="Mở Table of Contents"
      >
        📋
      </StyledFloatingButton>

      {isOpen && (
        <StyledOverlay onClick={() => setIsOpen(false)}>
          <StyledModal onClick={(e) => e.stopPropagation()}>
            <StyledHeader>
              <StyledTitle>📋 Table of Contents</StyledTitle>
              <StyledCloseButton
                onClick={() => setIsOpen(false)}
                aria-label="Đóng Table of Contents"
              >
                ✕
              </StyledCloseButton>
            </StyledHeader>
            
            <StyledContent>
              {toc.map((item) => (
                <StyledListItem
                  key={item.id}
                  level={item.level}
                  isActive={activeId === item.id}
                  onClick={() => handleItemClick(item.id)}
                >
                  <StyledBullet level={item.level} isActive={activeId === item.id}>
                    {item.level === 1 ? '●' : item.level === 2 ? '◦' : '▪'}
                  </StyledBullet>
                  <StyledText>{item.text}</StyledText>
                </StyledListItem>
              ))}
            </StyledContent>
          </StyledModal>
        </StyledOverlay>
      )}
    </>
  )
}

export default MobileTableOfContents

const StyledFloatingButton = styled.button`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) =>
    theme.scheme === 'light' 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'};
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 1000;
  display: none;

  @media (max-width: 1200px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  @media (min-width: 1201px) {
    display: none;
  }
`

const StyledModal = styled.div`
  background: ${({ theme }) =>
    theme.scheme === 'light' ? 'white' : theme.colors.gray4};
  border-radius: 16px;
  max-width: 90vw;
  max-height: 80vh;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) =>
    theme.scheme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
`

const StyledTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) =>
    theme.scheme === 'light' ? theme.colors.gray12 : theme.colors.gray1};
`

const StyledCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) =>
    theme.scheme === 'light' ? theme.colors.gray9 : theme.colors.gray5};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) =>
      theme.scheme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
    color: ${({ theme }) =>
      theme.scheme === 'light' ? theme.colors.gray12 : theme.colors.gray1};
  }
`

const StyledContent = styled.div`
  padding: 1rem;
  max-height: calc(80vh - 100px);
  overflow-y: auto;
`

type StyledListItemProps = {
  level: number
  isActive: boolean
}

const StyledListItem = styled.div<StyledListItemProps>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  margin-left: ${({ level }) => (level - 1) * 1.5}rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background-color: ${({ theme, isActive }) =>
    isActive 
      ? theme.scheme === 'light' 
        ? 'rgba(59, 130, 246, 0.1)' 
        : 'rgba(59, 130, 246, 0.2)'
      : 'transparent'};

  &:hover {
    background-color: ${({ theme }) =>
      theme.scheme === 'light' 
        ? 'rgba(0, 0, 0, 0.05)' 
        : 'rgba(255, 255, 255, 0.05)'};
  }

  &:hover span:last-child {
    color: ${({ theme }) =>
      theme.scheme === 'light' ? theme.colors.gray12 : theme.colors.gray1};
  }

  &:active {
    transform: scale(0.98);
  }
`

const StyledBullet = styled.span<StyledListItemProps>`
  font-size: ${({ level }) => 
    level === 1 ? '0.9rem' : level === 2 ? '0.85rem' : '0.75rem'};
  color: ${({ theme, isActive }) =>
    isActive 
      ? theme.scheme === 'light' ? theme.colors.blue11 : theme.colors.blue9
      : theme.scheme === 'light' ? theme.colors.gray9 : theme.colors.gray5};
  margin-top: 0.1rem;
  flex-shrink: 0;
`

const StyledText = styled.span`
  font-size: 0.95rem;
  line-height: 1.5;
  color: ${({ theme }) =>
    theme.scheme === 'light' ? theme.colors.gray12 : theme.colors.gray12};
  word-break: break-word;
`
