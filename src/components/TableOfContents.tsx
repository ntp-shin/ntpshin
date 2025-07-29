import React, { useState, useMemo } from 'react'
import styled from '@emotion/styled'
import useTableOfContents from 'src/hooks/useTableOfContents'

type Props = {}

const TableOfContents: React.FC<Props> = () => {
  const { toc, activeId, scrollToHeading, position, isDragging, handleMouseDown } = useTableOfContents()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Tính toán tiến độ đọc
  const readingProgress = useMemo(() => {
    if (toc.length === 0) return { current: 0, total: 0, percentage: 0 }
    const currentIndex = toc.findIndex(item => item.id === activeId)
    const current = currentIndex === -1 ? 0 : currentIndex + 1
    const total = toc.length
    const percentage = Math.round((current / total) * 100)
    return { current, total, percentage }
  }, [toc, activeId])

  if (toc.length === 0) return null

  return (
    <StyledWrapper 
      style={{ 
        position: 'fixed',
        top: '50%',
        right: '20px',
        transform: 'translateY(-50%)'
      }}
      isDragging={isDragging}
      isCollapsed={isCollapsed}
      onClick={isCollapsed ? () => setIsCollapsed(false) : undefined}
    >
      <StyledHeader isCollapsed={isCollapsed}>
        {!isCollapsed && (
          <StyledToggleButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Thu gọn TOC"
          >
            ✕
          </StyledToggleButton>
        )}
        <StyledTitle isCollapsed={isCollapsed}>
          📋 {!isCollapsed && 'Table of Contents'}
        </StyledTitle>
      </StyledHeader>

      <StyledProgressSection isCollapsed={isCollapsed}>
        {!isCollapsed && (
          <>
            <StyledProgressBar>
              <StyledProgressFill progress={readingProgress.percentage} />
            </StyledProgressBar>
            <StyledProgressText>
              {/* {readingProgress.percentage}% */}
            </StyledProgressText>
          </>
        )}
        {isCollapsed && (
          <>
            <StyledVerticalProgressBar>
              <StyledVerticalProgressFill progress={readingProgress.percentage} />
            </StyledVerticalProgressBar>
            <StyledProgressTextCollapsed>
              {readingProgress.percentage}%
            </StyledProgressTextCollapsed>
          </>
        )}
      </StyledProgressSection>

      {!isCollapsed && (
        <StyledList>
          {toc.map((item) => (
            <StyledListItem
              key={item.id}
              level={item.level}
              isActive={activeId === item.id}
              onClick={() => scrollToHeading(item.id)}
              title={`Nhảy đến: ${item.text}`}
              aria-current={activeId === item.id ? 'true' : undefined}
            >
              <StyledBullet level={item.level} isActive={activeId === item.id}>
                {item.level === 1 ? '●' : item.level === 2 ? '◦' : '▪'}
              </StyledBullet>
              <StyledText>{item.text}</StyledText>
            </StyledListItem>
          ))}
        </StyledList>
      )}
    </StyledWrapper>
  )
}

export default TableOfContents

type StyledWrapperProps = {
  isDragging?: boolean
  isCollapsed?: boolean
}

type StyledTitleProps = {
  isCollapsed?: boolean
}

type StyledHeaderProps = {
  isCollapsed?: boolean
}

type StyledProgressSectionProps = {
  isCollapsed?: boolean
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  position: sticky;
  top: 50%;
  transform: translateY(-50%);
  max-height: calc(100vh - 200px);
  height: ${({ isCollapsed }) => isCollapsed ? 'calc((100vh - 200px) / 2)' : 'auto'};
  display: flex;
  flex-direction: column;
  padding: ${({ isCollapsed }) => isCollapsed ? '1.5rem 0.5rem' : '2rem'};
  background: ${({ theme }) =>
    theme.scheme === 'light' 
      ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 251, 255, 0.98) 100%)'
      : 'linear-gradient(145deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)'
  };
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid ${({ theme }) =>
    theme.scheme === 'light' 
      ? 'rgba(59, 130, 246, 0.15)' 
      : 'rgba(148, 163, 184, 0.1)'
  };
  box-shadow: ${({ theme }) =>
    theme.scheme === 'light'
      ? '0 20px 40px -10px rgba(59, 130, 246, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
      : '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 12px 25px -8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)'
  };
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-width: ${({ isCollapsed }) => isCollapsed ? '60px' : '300px'};
  width: ${({ isCollapsed }) => isCollapsed ? '60px' : 'auto'};
  cursor: ${({ isDragging, isCollapsed }) => 
    isDragging ? 'grabbing' : isCollapsed ? 'pointer' : 'default'};
  z-index: 1000;
  position: relative;
  justify-content: ${({ isCollapsed }) => isCollapsed ? 'space-between' : 'flex-start'};
  
  &:hover {
    transform: ${({ isDragging, isCollapsed }) => 
      isDragging ? 'translateY(-50%)' : isCollapsed ? 'translateY(-50%) translateX(-4px)' : 'translateY(-54px) scale(1.02)'};
    box-shadow: ${({ theme }) =>
      theme.scheme === 'light'
        ? '0 30px 60px -15px rgba(59, 130, 246, 0.25), 0 20px 40px -10px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
        : '0 35px 70px -15px rgba(0, 0, 0, 0.5), 0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(148, 163, 184, 0.15)'
    };
  }
  
  @media (max-width: 1200px) {
    display: none;
  }
`

const StyledHeader = styled.div<StyledHeaderProps>`
  display: flex;
  align-items: center;
  justify-content: ${({ isCollapsed }) => isCollapsed ? 'center' : 'center'};
  margin-bottom: 1rem;
  position: relative;
  flex-shrink: 0;
`

const StyledToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: ${({ theme }) =>
    theme.scheme === 'light' ? theme.colors.gray9 : theme.colors.gray5};
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;

  &:hover {
    background: ${({ theme }) =>
      theme.scheme === 'light' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(148, 163, 184, 0.1)'};
    color: ${({ theme }) =>
      theme.scheme === 'light' ? theme.colors.blue11 : theme.colors.blue9};
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`

const StyledProgressSection = styled.div<StyledProgressSectionProps>`
  margin-bottom: ${({ isCollapsed }) => isCollapsed ? '0' : '1.5rem'};
  display: flex;
  flex-direction: ${({ isCollapsed }) => isCollapsed ? 'column' : 'column'};
  align-items: ${({ isCollapsed }) => isCollapsed ? 'center' : 'stretch'};
  gap: 0.5rem;
  flex-shrink: 0;
  position: relative;
  flex: ${({ isCollapsed }) => isCollapsed ? '1' : '0'};
  justify-content: ${({ isCollapsed }) => isCollapsed ? 'center' : 'flex-start'};
`

const StyledVerticalProgressBar = styled.div`
  width: 8px;
  height: calc(((100vh - 200px) / 2 - 3rem - 2rem) * 0.8);
  background: ${({ theme }) =>
    theme.scheme === 'light' ? theme.colors.gray3 : theme.colors.gray6};
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-bottom: 1rem;
`

const StyledVerticalProgressFill = styled.div<{ progress: number }>`
  width: 100%;
  background: ${({ theme }) =>
    theme.scheme === 'light' 
      ? 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)'};
  height: ${({ progress }) => progress}%;
  transition: height 0.5s ease-out;
  border-radius: 4px;
  position: absolute;
  top: 0;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmerVertical 2s infinite;
  }
  
  @keyframes shimmerVertical {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
`

const StyledProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) =>
    theme.scheme === 'light' ? theme.colors.gray3 : theme.colors.gray6};
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`

const StyledProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: ${({ theme }) =>
    theme.scheme === 'light' 
      ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)'};
  width: ${({ progress }) => progress}%;
  transition: width 0.5s ease-out;
  border-radius: 4px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`

const StyledProgressText = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) =>
    theme.scheme === 'light' ? theme.colors.gray9 : theme.colors.gray5};
  text-align: center;
  font-weight: 500;
`

const StyledProgressTextCollapsed = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) =>
    theme.scheme === 'light' ? theme.colors.blue11 : theme.colors.blue9};
  text-align: center;
  font-weight: 700;
  line-height: 1.2;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
`

const StyledTitle = styled.h3<StyledTitleProps>`
  font-size: ${({ isCollapsed }) => isCollapsed ? '1.8rem' : '1.5rem'};
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) =>
    theme.scheme === 'light' ? theme.colors.gray12 : theme.colors.gray12};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: ${({ isCollapsed }) => isCollapsed ? 'center' : 'left'};
  transition: all 0.3s ease;
  text-shadow: ${({ theme }) =>
    theme.scheme === 'light' ? '0 1px 2px rgba(0, 0, 0, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.3)'};
`

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  overflow-y: auto;
  flex: 1;
  min-height: 0;

  /* Custom scrollbar chỉ cho phần list */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) =>
      theme.scheme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) =>
      theme.scheme === 'light' 
        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(99, 102, 241, 0.6))'
        : 'linear-gradient(135deg, rgba(148, 163, 184, 0.4), rgba(99, 102, 241, 0.4))'
    };
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) =>
      theme.scheme === 'light' 
        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(99, 102, 241, 0.8))'
        : 'linear-gradient(135deg, rgba(148, 163, 184, 0.6), rgba(99, 102, 241, 0.6))'
    };
  }
`

type StyledListItemProps = {
  level: number
  isActive: boolean
}

const StyledListItem = styled.li<StyledListItemProps>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin-left: ${({ level }) => (level - 1) * 1.2}rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  
  background-color: ${({ theme, isActive }) =>
    isActive 
      ? theme.scheme === 'light' 
        ? 'rgba(59, 130, 246, 0.12)' 
        : 'rgba(99, 102, 241, 0.15)'
      : 'transparent'};

  border: 1px solid ${({ theme, isActive }) =>
    isActive 
      ? theme.scheme === 'light' 
        ? 'rgba(59, 130, 246, 0.2)' 
        : 'rgba(99, 102, 241, 0.2)'
      : 'transparent'};

  &:hover {
    background: ${({ theme }) =>
      theme.scheme === 'light' 
        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(99, 102, 241, 0.06))'
        : 'linear-gradient(135deg, rgba(148, 163, 184, 0.08), rgba(99, 102, 241, 0.1))'};
    transform: translateX(6px) scale(1.02);
    border-color: ${({ theme }) =>
      theme.scheme === 'light' 
        ? 'rgba(59, 130, 246, 0.15)' 
        : 'rgba(148, 163, 184, 0.15)'};
    box-shadow: ${({ theme }) =>
      theme.scheme === 'light'
        ? '0 8px 25px -8px rgba(59, 130, 246, 0.2)'
        : '0 8px 25px -8px rgba(0, 0, 0, 0.3)'
    };
  }

  &:hover span:last-child {
    color: ${({ theme }) =>
      theme.scheme === 'light' ? theme.colors.blue11 : theme.colors.blue9};
    font-weight: 500;
  }

  &[aria-current="true"] span:last-child {
    color: ${({ theme }) =>
      theme.scheme === 'light' ? theme.colors.blue11 : theme.colors.blue9};
    font-weight: 600;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${({ theme, isActive }) =>
      isActive 
        ? theme.scheme === 'light' 
          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(99, 102, 241, 0.8))'
          : 'linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(139, 92, 246, 0.8))'
        : 'transparent'
    };
    border-radius: 0 8px 8px 0;
    transition: all 0.3s ease;
    opacity: ${({ isActive }) => isActive ? 1 : 0};
    transform: scaleY(${({ isActive }) => isActive ? 1 : 0.3});
  }

  &::after {
    content: '';
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme, isActive }) =>
      isActive 
        ? theme.scheme === 'light' 
          ? 'rgba(59, 130, 246, 0.8)'
          : 'rgba(99, 102, 241, 0.8)'
        : 'transparent'
    };
    transition: all 0.3s ease;
    opacity: ${({ isActive }) => isActive ? 1 : 0};
  }
`

const StyledBullet = styled.span<StyledListItemProps>`
  font-size: ${({ level }) => 
    level === 1 ? '0.85rem' : level === 2 ? '0.88rem' : '0.85rem'};
  color: ${({ theme, isActive }) =>
    isActive 
      ? theme.scheme === 'light' ? theme.colors.blue11 : theme.colors.blue9
      : theme.scheme === 'light' ? theme.colors.gray9 : theme.colors.gray5};
  transition: all 0.3s ease;
  margin-top: 0.1rem;
  flex-shrink: 0;
  filter: ${({ isActive }) => 
    isActive ? 'drop-shadow(0 0 4px currentColor)' : 'none'};
`

const StyledText = styled.span`
  font-size: 1rem;
  line-height: 1.4;
  color: ${({ theme }) =>
    theme.scheme === 'light' ? theme.colors.gray12 : theme.colors.gray12};
  transition: all 0.3s ease;
  word-break: break-word;
  white-space: pre-wrap;
  hyphens: auto;
  font-weight: 400;
`
