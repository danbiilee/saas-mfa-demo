import React from 'react';
import styled from 'styled-components';

const Button = ({ onClick, children }: { onClick: any; children: any }) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};

const StyledButton = styled.button`
  background-color: darkblue;
  color: #fff;
`;

export default Button;
