import React from 'react'
import styled from '@emotion/styled'
import useTableOfContents from 'src/hooks/useTableOfContents'

type Props = {}

const TableOfContents: React.FC<Props> = () => {
  const { toc, activeId, scrollToHeading, position, isDragging, handleMouseDown } = useTableOfContents()

  if (toc.length === 0) return null

  return (
    <StyledWrapper 
      style={{ 
        position: 'fixed',
        top: `${position.y}px`,
        right: '20px',
        transform: 'none'
      }}
      isDragging={isDragging}
    >
      <StyledTitle>📋 Table of Contents</StyledTitle>
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
    </StyledWrapper>
  )
}

export default TableOfContents

type StyledWrapperProps = {
  isDragging?: boolean
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  position: sticky;
  top: 120px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding: 2rem;
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
  min-width: 300px;
  cursor: ${({ isDragging }) => isDragging ? 'grabbing' : 'default'};
  z-index: 1000;
  
  &:hover {
    transform: ${({ isDragging }) => 
      isDragging ? 'none' : 'translateY(-4px) scale(1.02)'};
    box-shadow: ${({ theme }) =>
      theme.scheme === 'light'
        ? '0 30px 60px -15px rgba(59, 130, 246, 0.25), 0 20px 40px -10px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
        : '0 35px 70px -15px rgba(0, 0, 0, 0.5), 0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(148, 163, 184, 0.15)'
    };
  }
  
  @media (max-width: 1200px) {
    display: none;
  }

  /* Custom scrollbar */
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

const StyledTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${({ theme }) =>
    theme.scheme === 'light' ? theme.colors.gray12 : theme.colors.gray12};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${({ theme }) =>
    theme.scheme === 'light' 
      ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.2))'
      : 'linear-gradient(90deg, rgba(148, 163, 184, 0.3), rgba(99, 102, 241, 0.2))'
  };
  position: relative;
  text-shadow: ${({ theme }) =>
    theme.scheme === 'light' ? '0 1px 2px rgba(0, 0, 0, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.3)'};

  &::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ theme }) =>
      theme.scheme === 'light' 
        ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.6), rgba(99, 102, 241, 0.4))'
        : 'linear-gradient(90deg, rgba(148, 163, 184, 0.4), rgba(99, 102, 241, 0.6))'
    };
    border-radius: 2px;
  }

  &::after {
    content: '✨';
    font-size: 0.8rem;
    opacity: 0.7;
    animation: sparkle 2s ease-in-out infinite;
  }

  @keyframes sparkle {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }
`

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
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
  line-height: 1.5;
  color: ${({ theme }) =>
    theme.scheme === 'light' ? theme.colors.gray12 : theme.colors.gray12};
  transition: all 0.3s ease;
  word-break: break-word;
  font-weight: 400;
`
